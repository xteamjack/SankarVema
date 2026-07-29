/**
 * LLM provider adapter for the ZettaMine chatbot.
 *
 * Streams structured events (text deltas + tool calls) over plain fetch, so the
 * agent loop (./agent.ts) can run a first-level help desk. Supports:
 *   - vllm   (DEFAULT) — the on-prem GPU (OpenAI-compatible). Connection
 *              details come from the SANS config server (see ./configClient.ts),
 *              never from ZettaMine's own env/code, and never reach the browser.
 *   - anthropic / openai / azure — via NUXT_CHAT_* env (kept for flexibility).
 *
 * Config (env, server side only):
 *   NUXT_CHAT_PROVIDER    vllm | anthropic | openai | azure   (default vllm)
 *   NUXT_CHAT_LLM_BLOCK   which ai.llm block for vllm mode     (default vllm)
 *   NUXT_CHAT_MODEL       override the model id                (optional)
 *   NUXT_CHAT_MAX_TOKENS  max output tokens                    (default 1024)
 *   NUXT_CHAT_API_KEY     key for anthropic/openai/azure modes
 *   NUXT_CHAT_AZURE_*     endpoint / deployment / api version  (azure mode)
 *   SANS_SERVER_CONFIG    config server URL                    (vllm mode)
 */
import { getLlmBlock } from './configClient'

export type ChatRole = 'user' | 'assistant'
export interface ChatMessage { role: ChatRole; content: string }

export type Provider = 'anthropic' | 'openai' | 'azure' | 'vllm'

export interface ChatConfig {
  provider: Provider
  apiKey: string
  model: string
  baseUrl: string
  maxTokens: number
  temperature?: number
  azureEndpoint: string
  azureDeployment: string
  azureApiVersion: string
}

export interface ToolDef {
  name: string
  description: string
  input_schema: Record<string, unknown>
}

export type StreamEvent =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: any }
  | { type: 'done'; stopReason: string }

/**
 * Resolves the live chat config. For vllm mode this fetches the connection
 * details from the config server (secrets resolved there); for the other modes
 * it reads env. Returns an unconfigured shell (empty baseUrl/apiKey) on failure
 * so the caller can serve a friendly "not switched on" message.
 */
export async function resolveChatConfig(): Promise<ChatConfig> {
  const provider = (process.env.NUXT_CHAT_PROVIDER || 'vllm').toLowerCase() as Provider
  const cfg: ChatConfig = {
    provider,
    apiKey: process.env.NUXT_CHAT_API_KEY || '',
    model: process.env.NUXT_CHAT_MODEL || '',
    baseUrl: '',
    // A low ceiling so answers stay short (a 15-second read). The prompt sets
    // the target; this caps runaway output regardless of the model's own limit.
    maxTokens: Number(process.env.NUXT_CHAT_MAX_TOKENS || '170'),
    azureEndpoint: (process.env.NUXT_CHAT_AZURE_ENDPOINT || '').replace(/\/$/, ''),
    azureDeployment: process.env.NUXT_CHAT_AZURE_DEPLOYMENT || '',
    azureApiVersion: process.env.NUXT_CHAT_AZURE_API_VERSION || '2024-08-01-preview',
  }

  if (provider === 'anthropic') { cfg.model ||= 'claude-haiku-4-5-20251001'; return cfg }
  if (provider === 'openai' || provider === 'azure') { cfg.model ||= 'gpt-4o-mini'; return cfg }

  // vllm (default): resolve baseUrl / model / key from the config server.
  cfg.provider = 'vllm'
  try {
    const block = process.env.NUXT_CHAT_LLM_BLOCK || 'vllm'
    const b = await getLlmBlock(block)
    cfg.baseUrl = String(b.baseUrl || '').replace(/\/$/, '')
    cfg.model = process.env.NUXT_CHAT_MODEL || String(b.model || '')
    cfg.apiKey = b.apiKey ? String(b.apiKey) : ''
    // Intentionally do NOT take the block's maxTokens (it is 8192 for the resume
    // parser); the chat keeps the low cap set above so replies stay short.
    if (b.temperature != null) cfg.temperature = Number(b.temperature)
  } catch (err: any) {
    console.error('[chat] could not resolve vLLM config from config server:', err?.message || err)
  }
  return cfg
}

export function isConfigured(cfg: ChatConfig): boolean {
  if (cfg.provider === 'vllm') return !!cfg.baseUrl && !!cfg.model
  if (cfg.provider === 'azure') return !!cfg.apiKey && !!cfg.azureEndpoint && !!cfg.azureDeployment
  return !!cfg.apiKey
}

/** Yields each `data:` payload string from an SSE response body. */
async function* sseData(res: Response): AsyncGenerator<string> {
  if (!res.body) return
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    let idx: number
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).replace(/\r$/, '')
      buf = buf.slice(idx + 1)
      if (line.startsWith('data:')) yield line.slice(5).trim()
    }
  }
  const rest = buf.replace(/\r$/, '')
  if (rest.startsWith('data:')) yield rest.slice(5).trim()
}

async function* streamAnthropic(cfg: ChatConfig, system: string, messages: any[], tools: ToolDef[]): AsyncGenerator<StreamEvent> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: cfg.model, max_tokens: cfg.maxTokens, system, messages, tools, stream: true }),
  })
  if (!res.ok) {
    let detail = ''
    try { detail = await res.text() } catch { /* ignore */ }
    throw new Error(`Anthropic request failed (${res.status}): ${detail.slice(0, 500)}`)
  }

  const blocks: Record<number, { type: string; id?: string; name?: string; json?: string }> = {}
  let stopReason = ''
  for await (const payload of sseData(res)) {
    if (!payload) continue
    let evt: any
    try { evt = JSON.parse(payload) } catch { continue }
    switch (evt.type) {
      case 'content_block_start': {
        const cb = evt.content_block
        blocks[evt.index] = cb?.type === 'tool_use'
          ? { type: 'tool_use', id: cb.id, name: cb.name, json: '' }
          : { type: cb?.type || 'text' }
        break
      }
      case 'content_block_delta': {
        const d = evt.delta
        if (d?.type === 'text_delta') yield { type: 'text', text: d.text }
        else if (d?.type === 'input_json_delta') {
          const b = blocks[evt.index]
          if (b) b.json = (b.json || '') + d.partial_json
        }
        break
      }
      case 'content_block_stop': {
        const b = blocks[evt.index]
        if (b?.type === 'tool_use') {
          let input: any = {}
          try { input = b.json ? JSON.parse(b.json) : {} } catch { /* keep {} */ }
          yield { type: 'tool_use', id: b.id!, name: b.name!, input }
        }
        break
      }
      case 'message_delta':
        if (evt.delta?.stop_reason) stopReason = evt.delta.stop_reason
        break
      case 'message_stop':
        yield { type: 'done', stopReason }
        return
      case 'error':
        throw new Error(`Anthropic stream error: ${evt.error?.message || 'unknown'}`)
    }
  }
  yield { type: 'done', stopReason }
}

// Covers OpenAI, Azure OpenAI, and vLLM (all OpenAI-compatible chat/completions).
async function* streamOpenAILike(cfg: ChatConfig, system: string, messages: any[], tools: ToolDef[]): AsyncGenerator<StreamEvent> {
  const url = cfg.provider === 'azure'
    ? `${cfg.azureEndpoint}/openai/deployments/${cfg.azureDeployment}/chat/completions?api-version=${cfg.azureApiVersion}`
    : cfg.provider === 'vllm'
      ? `${cfg.baseUrl}/chat/completions`
      : 'https://api.openai.com/v1/chat/completions'

  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (cfg.provider === 'azure') headers['api-key'] = cfg.apiKey
  else if (cfg.apiKey) headers['authorization'] = `Bearer ${cfg.apiKey}` // vLLM may need no key

  const label = cfg.provider === 'azure' ? 'Azure OpenAI' : cfg.provider === 'vllm' ? 'vLLM' : 'OpenAI'

  const doFetch = (withTools: boolean) => {
    const body: Record<string, unknown> = {
      messages: [{ role: 'system', content: system }, ...messages],
      stream: true,
      max_tokens: cfg.maxTokens,
    }
    if (cfg.provider !== 'azure') body.model = cfg.model
    if (cfg.temperature != null) body.temperature = cfg.temperature
    if (withTools && tools.length) {
      body.tools = tools.map(t => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.input_schema } }))
    }
    return fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  }

  let res = await doFetch(tools.length > 0)
  if (!res.ok) {
    let detail = ''
    try { detail = await res.text() } catch { /* ignore */ }
    // Some OpenAI-compatible backends (older vLLM builds without a tool parser)
    // reject the tools field. Retry once without tools so basic chat still works.
    if (res.status === 400 && tools.length > 0 && /tool|function/i.test(detail)) {
      res = await doFetch(false)
      if (!res.ok) {
        let d2 = ''
        try { d2 = await res.text() } catch { /* ignore */ }
        throw new Error(`${label} request failed (${res.status}): ${d2.slice(0, 500)}`)
      }
    } else {
      throw new Error(`${label} request failed (${res.status}): ${detail.slice(0, 500)}`)
    }
  }

  const toolAcc: Record<number, { id?: string; name?: string; args: string }> = {}
  let finish = ''
  for await (const payload of sseData(res)) {
    if (payload === '[DONE]') break
    if (!payload) continue
    let evt: any
    try { evt = JSON.parse(payload) } catch { continue }
    const choice = evt.choices?.[0]
    if (!choice) continue
    const delta = choice.delta || {}
    if (typeof delta.content === 'string' && delta.content) yield { type: 'text', text: delta.content }
    if (Array.isArray(delta.tool_calls)) {
      for (const tc of delta.tool_calls) {
        const idx = tc.index ?? 0
        const acc = toolAcc[idx] || (toolAcc[idx] = { args: '' })
        if (tc.id) acc.id = tc.id
        if (tc.function?.name) acc.name = tc.function.name
        if (tc.function?.arguments) acc.args += tc.function.arguments
      }
    }
    if (choice.finish_reason) finish = choice.finish_reason
  }

  for (const key of Object.keys(toolAcc)) {
    const acc = toolAcc[Number(key)]!
    if (!acc.name) continue
    let input: any = {}
    try { input = acc.args ? JSON.parse(acc.args) : {} } catch { /* keep {} */ }
    yield { type: 'tool_use', id: acc.id || `call_${key}`, name: acc.name, input }
  }
  yield { type: 'done', stopReason: finish || (Object.keys(toolAcc).length ? 'tool_calls' : 'stop') }
}

/** Streams one model turn as structured events. `messages` are provider native. */
export function streamTurn(cfg: ChatConfig, system: string, messages: any[], tools: ToolDef[]): AsyncGenerator<StreamEvent> {
  return cfg.provider === 'anthropic'
    ? streamAnthropic(cfg, system, messages, tools)
    : streamOpenAILike(cfg, system, messages, tools)
}

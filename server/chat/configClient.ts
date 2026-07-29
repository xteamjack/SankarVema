/**
 * Server-side config-server client for the ZettaMine chatbot.
 *
 * Mirrors the recruiter app's secure pattern (n_dh_ms_fn_recruiter
 * server/utils/configClient.ts + jobParserLlmClient.ts): the LLM connection
 * details (vLLM baseUrl + apiKey) live in the SANS config server, which resolves
 * ${secret...} placeholders server-side before returning them. We fetch them
 * from Nitro (server side only) and use them to call the model — the values are
 * NEVER sent to the browser and there is NO public route that returns config.
 * This is why the secret can stay out of ZettaMine's own env/code.
 *
 * ZettaMine is not on the sans-way @libs framework, so instead of importing
 * `@libs/core/config` we replicate its tiny HTTP contract directly:
 *   GET {SANS_SERVER_CONFIG}/api/key?key=<key>&tenant=<tenant>  ->  { value }
 *
 * Requires the SANS_SERVER_CONFIG env var (e.g. http://127.0.0.1:3101).
 */

// Config is effectively static per process; cache the resolved block. A server
// restart picks up config edits (same policy as the recruiter client).
const blockCache = new Map<string, any>()

function configBaseUrl(): string {
  const url = process.env.SANS_SERVER_CONFIG
  if (!url) throw new Error('SANS_SERVER_CONFIG is not set; cannot resolve LLM config from the config server')
  return url.replace(/\/$/, '')
}

async function getConfigByKey(key: string, tenant = 'generic'): Promise<any> {
  const url = `${configBaseUrl()}/api/key?key=${encodeURIComponent(key)}&tenant=${encodeURIComponent(tenant)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`config server responded ${res.status} for key '${key}'`)
  const json: any = await res.json()
  return json?.value
}

export interface LlmBlock {
  provider?: string
  baseUrl?: string
  model?: string
  apiKey?: string
  temperature?: number
  maxTokens?: number
  maxCompletionTokens?: number
  timeoutSecs?: number
}

/**
 * Returns one named block from the `ai.llm` config (e.g. `vllm`, `groq`,
 * `ollama`), with secrets already resolved by the config server.
 */
export async function getLlmBlock(block = 'vllm', tenant = 'generic'): Promise<LlmBlock> {
  const cacheKey = `${tenant}::${block}`
  const cached = blockCache.get(cacheKey)
  if (cached) return cached

  const llm = await getConfigByKey('ai.llm', tenant)
  const value = llm?.[block]
  if (!value || typeof value !== 'object') {
    throw new Error(`ai.llm.${block} block is missing in the config server`)
  }
  blockCache.set(cacheKey, value)
  return value as LlmBlock
}

/**
 * Agent loop for the ZettaMine help-desk bot.
 *
 * Streams the assistant reply as text, and when the model calls a tool it runs
 * the tool server side and lets the model continue (multi-step). This is what
 * turns the bot from a Q&A surface into a first-level help desk: it can collect
 * details across turns and file an enquiry.
 *
 * Transcript is kept in a normalized shape and converted to each provider's
 * native message format per call.
 */
import { streamTurn, type ChatConfig, type ChatMessage } from './provider'
import { TOOLS, executeTool } from './tools'

const MAX_STEPS = 5

type Item =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string }
  | { role: 'assistant'; text: string; toolUses: { id: string; name: string; input: any }[] }
  | { role: 'tool'; results: { id: string; content: string }[] }

export function toTranscript(messages: ChatMessage[]): Item[] {
  return messages.map(m => ({ role: m.role, content: m.content }))
}

function toAnthropic(items: Item[]): any[] {
  return items.map((it: any) => {
    if (it.role === 'user') return { role: 'user', content: it.content }
    if (it.role === 'assistant' && it.toolUses) {
      const content: any[] = []
      if (it.text) content.push({ type: 'text', text: it.text })
      for (const t of it.toolUses) content.push({ type: 'tool_use', id: t.id, name: t.name, input: t.input })
      return { role: 'assistant', content }
    }
    if (it.role === 'assistant') return { role: 'assistant', content: it.content }
    // tool results ride on a user turn for Anthropic
    return { role: 'user', content: it.results.map((r: any) => ({ type: 'tool_result', tool_use_id: r.id, content: r.content })) }
  })
}

function toOpenAI(items: Item[]): any[] {
  const out: any[] = []
  for (const it of items as any[]) {
    if (it.role === 'user') { out.push({ role: 'user', content: it.content }); continue }
    if (it.role === 'assistant' && it.toolUses) {
      out.push({
        role: 'assistant',
        content: it.text || null,
        tool_calls: it.toolUses.map((t: any) => ({ id: t.id, type: 'function', function: { name: t.name, arguments: JSON.stringify(t.input) } })),
      })
      continue
    }
    if (it.role === 'assistant') { out.push({ role: 'assistant', content: it.content }); continue }
    for (const r of it.results) out.push({ role: 'tool', tool_call_id: r.id, content: r.content })
  }
  return out
}

function toProviderMessages(cfg: ChatConfig, items: Item[]): any[] {
  return cfg.provider === 'anthropic' ? toAnthropic(items) : toOpenAI(items)
}

/** Runs the answer + tool loop, yielding text deltas for the client to render. */
export async function* runAgent(cfg: ChatConfig, system: string, items: Item[]): AsyncGenerator<string> {
  for (let step = 0; step < MAX_STEPS; step++) {
    const messages = toProviderMessages(cfg, items)
    const toolUses: { id: string; name: string; input: any }[] = []
    let text = ''

    for await (const ev of streamTurn(cfg, system, messages, TOOLS)) {
      if (ev.type === 'text') { text += ev.text; yield ev.text }
      else if (ev.type === 'tool_use') toolUses.push({ id: ev.id, name: ev.name, input: ev.input })
    }

    // No tool call means the model gave its final answer (already streamed).
    if (toolUses.length === 0) return

    items.push({ role: 'assistant', text, toolUses })

    const results: { id: string; content: string }[] = []
    for (const tu of toolUses) {
      let result: any
      try { result = await executeTool(tu.name, tu.input) }
      catch (err) { result = { ok: false, error: String(err) } }
      results.push({ id: tu.id, content: JSON.stringify(result) })
    }
    items.push({ role: 'tool', results })
  }

  yield '\n\nLet me know if there is anything else I can help with, or leave your details and our team will reach out.'
}

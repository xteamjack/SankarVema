/**
 * ZettaMine chatbot turn. Streams the assistant reply back as plain text so the
 * widget can render it token by token. Body: { messages: [{role, content}] }.
 * v1 context stuffs the whole (small) knowledge base into the system prompt.
 * Default model is the on-prem vLLM resolved from the config server.
 * See n_dh_docs/zetta/chatbot/implementation.md.
 */
import { SYSTEM_PROMPT } from '../chat/systemPrompt'
import { KNOWLEDGE } from '../chat/knowledge'
import { resolveChatConfig, isConfigured, type ChatMessage } from '../chat/provider'
import { runAgent, toTranscript } from '../chat/agent'

const NOT_CONFIGURED =
  "Thanks for reaching out! The assistant is not fully switched on yet. " +
  "In the meantime, explore the work, or leave a note on the Ask page and Sankar will get back to you."

function sanitize(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return []
  const cleaned: ChatMessage[] = []
  for (const m of raw as any[]) {
    const role = m?.role === 'assistant' ? 'assistant' : m?.role === 'user' ? 'user' : null
    const content = typeof m?.content === 'string' ? m.content.trim() : ''
    if (!role || !content) continue
    cleaned.push({ role, content: content.slice(0, 4000) })
  }
  return cleaned.slice(-12)
}

async function* single(text: string): AsyncGenerator<string> { yield text }

function textStream(gen: AsyncGenerator<string>): ReadableStream {
  const enc = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of gen) controller.enqueue(enc.encode(delta))
      } catch (err) {
        console.error('[chat] stream error', err)
        controller.enqueue(enc.encode(
          '\n\nSorry, something went wrong on our side. Please try again in a moment.',
        ))
      } finally {
        controller.close()
      }
    },
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const messages = sanitize((body as any)?.messages)

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'no-cache, no-transform')
  setResponseHeader(event, 'x-accel-buffering', 'no')

  if (messages.length === 0) {
    return textStream(single('Ask me anything about Sankar and his work, and I will help.'))
  }

  const cfg = await resolveChatConfig()
  if (!isConfigured(cfg)) return textStream(single(NOT_CONFIGURED))

  const system = `${SYSTEM_PROMPT}\n\n${KNOWLEDGE}`
  return textStream(runAgent(cfg, system, toTranscript(messages)))
})

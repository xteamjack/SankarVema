/**
 * "Explain this page" — takes the page's visible text and returns a short,
 * spoken-style summary (streamed) with tap-to-continue buttons. Body:
 * { path: string, content: string }. No tools; pure text generation.
 */
import { EXPLAIN_PROMPT } from '../../chat/explainPrompt'
import { resolveChatConfig, isConfigured, streamTurn } from '../../chat/provider'

const NOT_CONFIGURED =
  "The explainer is not switched on yet. Explore the page, or ask the team via the Contact page.\n" +
  "[[SUGGESTIONS]] Talk to the team => /contact | Go to solutions => /solutions"

const NOTHING =
  "There is not much on this page for me to summarise yet. Ask me anything about Sankar and his work instead.\n" +
  "[[SUGGESTIONS]] What do you do? | See solutions => /solutions | Talk to the team => /contact"

async function* single(text: string): AsyncGenerator<string> { yield text }

async function* explainStream(cfg: any, system: string, messages: any[]): AsyncGenerator<string> {
  for await (const ev of streamTurn(cfg, system, messages, [])) {
    if (ev.type === 'text') yield ev.text
  }
}

function textStream(gen: AsyncGenerator<string>): ReadableStream {
  const enc = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of gen) controller.enqueue(enc.encode(delta))
      } catch (err) {
        console.error('[explain] stream error', err)
        controller.enqueue(enc.encode('\n\nSorry, I could not summarise this page just now.'))
      } finally {
        controller.close()
      }
    },
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const path = String((body as any)?.path || '').slice(0, 200)
  const content = String((body as any)?.content || '').replace(/\s+/g, ' ').trim().slice(0, 6000)

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'no-cache, no-transform')
  setResponseHeader(event, 'x-accel-buffering', 'no')

  if (!content) return textStream(single(NOTHING))

  const cfg = await resolveChatConfig()
  if (!isConfigured(cfg)) return textStream(single(NOT_CONFIGURED))

  const messages = [{ role: 'user', content: `Current path: ${path}\n\nPage text:\n${content}` }]
  return textStream(explainStream(cfg, EXPLAIN_PROMPT, messages))
})

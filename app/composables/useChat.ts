/**
 * Shared client state for the ZettaMine chat widget and the "Explain this page"
 * agent. Uses useState so the widget (in the layout) and a page button share one
 * conversation and one open/closed flag.
 *
 * - send(text)          : normal chat turn -> /api/chat
 * - explain(path, text) : summarise the current page -> /api/chat/explain,
 *                         opens the widget and flags the message to be spoken.
 */
export interface ChatUiMessage {
  role: 'user' | 'assistant'
  content: string
  speak?: boolean   // this assistant message should be read aloud (explain)
  spoke?: boolean   // already spoken (set by the widget)
}

export function useChat() {
  const messages = useState<ChatUiMessage[]>('zm-chat-messages', () => [])
  const isStreaming = useState('zm-chat-streaming', () => false)
  const isOpen = useState('zm-chat-open', () => false)
  const error = useState<string | null>('zm-chat-error', () => null)

  async function stream(endpoint: string, payload: unknown, idx: number) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      messages.value[idx]!.content += decoder.decode(value, { stream: true })
    }
  }

  async function send(text: string) {
    const content = text.trim()
    if (!content || isStreaming.value) return
    error.value = null

    messages.value.push({ role: 'user', content })
    const payload = messages.value.map(m => ({ role: m.role, content: m.content }))
    messages.value.push({ role: 'assistant', content: '' })
    const idx = messages.value.length - 1
    isStreaming.value = true
    try {
      await stream('/api/chat', { messages: payload }, idx)
    } catch (e) {
      error.value = 'Something went wrong. Please try again.'
      if (!messages.value[idx]!.content) {
        messages.value[idx]!.content = 'Sorry, I could not respond just now. Please try again in a moment.'
      }
    } finally {
      isStreaming.value = false
    }
  }

  async function explain(path: string, pageText: string) {
    if (isStreaming.value) return
    error.value = null
    isOpen.value = true

    messages.value.push({ role: 'user', content: 'Explain this page' })
    messages.value.push({ role: 'assistant', content: '', speak: true })
    const idx = messages.value.length - 1
    isStreaming.value = true
    try {
      await stream('/api/chat/explain', { path, content: pageText }, idx)
    } catch (e) {
      error.value = 'Something went wrong. Please try again.'
      if (!messages.value[idx]!.content) {
        messages.value[idx]!.content = 'Sorry, I could not summarise this page just now. Ask me anything about Sankar and his work instead.'
      }
    } finally {
      isStreaming.value = false
    }
  }

  function reset() {
    messages.value = []
    error.value = null
  }

  return { messages, isStreaming, isOpen, error, send, explain, reset }
}

/**
 * Tiny, safe markdown to HTML renderer for chat answers. Escapes first, then
 * applies a small subset (paragraphs, bullet/numbered lists, bold, italic,
 * inline code, links). Internal links (starting with "/") are tagged with
 * data-internal so the widget can navigate in-app instead of a full reload.
 *
 * Deliberately dependency free to keep the GT site self contained.
 */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  // links [text](url) — http(s) or in-site (/path)
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    (_m, text: string, url: string) => {
      const internal = url.startsWith('/')
      const attrs = internal
        ? `href="${url}" data-internal="1"`
        : `href="${url}" target="_blank" rel="noopener"`
      return `<a ${attrs} class="font-medium text-ember-600 dark:text-ember-400 underline decoration-ember-500/40 underline-offset-2 hover:decoration-ember-500">${text}</a>`
    },
  )
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>')
  s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-ink-500/15 px-1 py-0.5 text-[0.85em]">$1</code>')
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  return s
}

export function renderMarkdown(src: string): string {
  const text = escapeHtml((src || '').trim())
  const lines = text.split('\n')
  const out: string[] = []
  let list: null | 'ul' | 'ol' = null
  let para: string[] = []

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = [] }
  }
  const flushList = () => {
    if (list) { out.push(`</${list}>`); list = null }
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flushPara(); flushList(); continue }

    const ul = line.match(/^[-*]\s+(.*)$/)
    const ol = line.match(/^\d+\.\s+(.*)$/)

    if (ul) {
      flushPara()
      if (list !== 'ul') { flushList(); out.push('<ul class="list-disc space-y-1 pl-5">'); list = 'ul' }
      out.push(`<li>${inline(ul[1]!)}</li>`)
    } else if (ol) {
      flushPara()
      if (list !== 'ol') { flushList(); out.push('<ol class="list-decimal space-y-1 pl-5">'); list = 'ol' }
      out.push(`<li>${inline(ol[1]!)}</li>`)
    } else {
      flushList()
      para.push(line)
    }
  }
  flushPara()
  flushList()
  return out.join('')
}

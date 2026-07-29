/**
 * Text-to-speech for the "Explain this page" agent, using the browser's built-in
 * Web Speech API (no infra, no cost). Kept behind this small seam so a
 * higher-quality server / GPU TTS can replace speak() later without touching the
 * widget: swap the body of speak() to fetch an audio URL and play it.
 */
export function useSpeech() {
  const speaking = ref(false)
  const supported = ref(false)

  onMounted(() => {
    supported.value = typeof window !== 'undefined' && 'speechSynthesis' in window
    // Voices can load asynchronously; touch them so they are ready on first use.
    if (supported.value) window.speechSynthesis.getVoices()
  })

  function pickVoice(): SpeechSynthesisVoice | null {
    const vs = window.speechSynthesis.getVoices()
    if (!vs.length) return null
    // Prefer a natural-sounding English voice, else any English, else default.
    return (
      vs.find(v => /^en/i.test(v.lang) && /natural|google|samantha|zira|aria|jenny/i.test(v.name)) ||
      vs.find(v => /^en[-_]?(GB|US|IN)/i.test(v.lang)) ||
      vs.find(v => /^en/i.test(v.lang)) ||
      null
    )
  }

  /** Strip markdown so brackets and URLs are never read aloud. */
  function toSpoken(text: string): string {
    return text
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [label](url) -> label
      .replace(/[*_`#>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function speak(text: string) {
    if (!supported.value) return
    const clean = toSpoken(text)
    if (!clean) return
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(clean)
    const v = pickVoice()
    if (v) u.voice = v
    u.lang = v?.lang || 'en-US'
    u.rate = 1.03
    u.pitch = 1
    u.onstart = () => { speaking.value = true }
    u.onend = () => { speaking.value = false }
    u.onerror = () => { speaking.value = false }
    synth.speak(u)
  }

  function stop() {
    if (!supported.value) return
    window.speechSynthesis.cancel()
    speaking.value = false
  }

  return { speak, stop, speaking, supported }
}

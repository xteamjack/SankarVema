/**
 * Liveness + config check for the chatbot. Reports the provider and whether the
 * model is reachable/configured, WITHOUT leaking any secret (no baseUrl/key).
 * Useful for a deploy gate and for diagnosing "not switched on" quickly.
 */
import { resolveChatConfig, isConfigured } from '../../chat/provider'

export default defineEventHandler(async () => {
  const cfg = await resolveChatConfig()
  return {
    ok: true,
    provider: cfg.provider,
    model: cfg.model || null,
    source: cfg.provider === 'vllm' ? 'config-server' : 'env',
    configured: isConfigured(cfg),
  }
})

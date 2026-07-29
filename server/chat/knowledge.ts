/**
 * Composes the site chatbot knowledge base as a single text block.
 *
 * Small enough to context-stuff (no retrieval / embeddings). Facts come from
 * ./kb/faq.ts, hand-authored from the site's own content. Keep it lean.
 */
import { FAQ_KNOWLEDGE } from './kb/faq'

export function buildKnowledge(): string {
  return [
    '== SANKAR VEMA KNOWLEDGE BASE ==',
    'Use only these facts. If something is not here, say you do not have that detail and offer to have Sankar follow up.',
    '',
    FAQ_KNOWLEDGE,
  ].join('\n')
}

// Static per deploy — build once at module load.
export const KNOWLEDGE = buildKnowledge()

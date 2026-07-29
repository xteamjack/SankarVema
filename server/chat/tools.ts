/**
 * Tools the site bot can call. The only side effect is filing an enquiry so
 * Sankar can follow up. The model decides when to call these; the agent loop
 * (./agent.ts) executes them server side.
 */
import type { ToolDef } from './provider'
import { persistEnquiry, type EnquiryInput, type EnquiryCategory } from './enquiries'

export const TOOLS: ToolDef[] = [
  {
    name: 'save_enquiry',
    description:
      'File an enquiry so Sankar can follow up. Use it when the visitor wants to discuss an engagement, an advisory conversation, mentorship, speaking, or asks to be contacted. ' +
      'Only call this once you have the visitor\'s name, at least one contact (work email or phone), and their clear agreement to be contacted. Pick the right category and include their company and what they are interested in.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Visitor full name' },
        email: { type: 'string', description: 'Work email (include if given)' },
        phone: { type: 'string', description: 'Phone number (include if given)' },
        company: { type: 'string', description: 'Company / organisation (if given)' },
        category: {
          type: 'string',
          enum: ['advisory', 'mentorship', 'speaking', 'general'],
          description: 'The nature of the enquiry',
        },
        interest: { type: 'string', description: 'Topic of interest (e.g. architecture review, fractional CTO, mentorship)' },
        notes: { type: 'string', description: 'Any useful context from the conversation' },
      },
      required: ['name', 'category'],
    },
  },
]

type ToolResult = Record<string, unknown>

async function saveEnquiry(input: any): Promise<ToolResult> {
  const name = String(input?.name || '').trim()
  const email = String(input?.email || '').trim()
  const phone = String(input?.phone || '').trim()
  const category = String(input?.category || 'general')
  const allowed = ['advisory', 'mentorship', 'speaking', 'general']

  if (!name) return { ok: false, error: 'Missing name. Ask the visitor for their name first.' }
  if (!email && !phone) return { ok: false, error: 'Missing contact. Ask for a work email or phone number, and confirm they are happy to be contacted, before saving.' }

  const record: EnquiryInput = {
    name,
    email: email || undefined,
    phone: phone || undefined,
    company: String(input?.company || '').trim() || undefined,
    category: (allowed.includes(category) ? category : 'general') as EnquiryCategory,
    interest: String(input?.interest || '').trim() || undefined,
    notes: String(input?.notes || '').trim() || undefined,
  }
  const id = await persistEnquiry(record)
  return { ok: true, ticketId: id, message: 'Enquiry filed. Sankar will follow up, typically within a couple of business days.' }
}

export async function executeTool(name: string, input: any): Promise<ToolResult> {
  if (name === 'save_enquiry') return saveEnquiry(input)
  return { ok: false, error: `Unknown tool: ${name}` }
}

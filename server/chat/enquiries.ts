/**
 * Persistence for enquiries the site bot captures (advisory, mentorship,
 * speaking, callbacks). Appends to a local JSONL file (backup) and forwards to
 * the CRM public intake, matching the site's ContactForm which POSTs to
 * `${crm}/api/public/queries`.
 *
 * CRM base is resolved from env (server side): NUXT_CHAT_CRM_URL, else the
 * site's own NUXT_PUBLIC_CRM_URL. If neither is set, the local file is the only
 * record (best-effort forwarding, never blocks the reply). On the ACA deploy the
 * CRM is same-origin under /crm, but a server-side forward needs an absolute
 * base, so set NUXT_CHAT_CRM_URL to the gateway or internal CRM URL to enable it.
 */
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

export type EnquiryCategory = 'advisory' | 'mentorship' | 'speaking' | 'general'

// The CRM /api/public/queries route validates `purpose` against an allowlist
// (client/partner/academy/careers/advisory/mentorship/diligence/speaking/other).
// Map our categories onto it so a forwarded enquiry is accepted.
const CRM_PURPOSE: Record<EnquiryCategory, string> = {
  advisory: 'advisory',
  mentorship: 'mentorship',
  speaking: 'speaking',
  general: 'other',
}

export interface EnquiryInput {
  name: string
  email?: string
  phone?: string
  company?: string
  category: EnquiryCategory
  interest?: string
  notes?: string
}

export interface EnquiryRecord extends EnquiryInput {
  id: string
  ts: string
}

function makeId(): string {
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = Math.floor(Math.random() * 1e6).toString(36).toUpperCase().padStart(4, '0')
  return `SV-${stamp}-${rand}`
}

function crmEndpoint(): string | null {
  const base = (process.env.NUXT_CHAT_CRM_URL || process.env.NUXT_PUBLIC_CRM_URL || '').replace(/\/$/, '')
  return base ? `${base}/api/public/queries` : null
}

async function forwardToCrm(record: EnquiryRecord): Promise<void> {
  const endpoint = crmEndpoint()
  if (!endpoint) return
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // Shape mirrors app/components/ContactForm.vue so the CRM stores it the
      // same way as a website contact. `website` is the honeypot (kept empty).
      body: JSON.stringify({
        purpose: CRM_PURPOSE[record.category] || 'other',
        name: record.name,
        email: record.email || '',
        company: record.company || '',
        interest: record.interest || record.category,
        message: record.notes || `Chatbot enquiry (${record.category})`,
        phone: record.phone || '',
        website: '',
      }),
    })
  } catch (err) {
    console.error('[chat] CRM forward failed', err)
  }
}

export async function persistEnquiry(input: EnquiryInput): Promise<string> {
  const record: EnquiryRecord = { id: makeId(), ts: new Date().toISOString(), ...input }

  try {
    const dir = join(process.cwd(), '.data', 'chat')
    await fs.mkdir(dir, { recursive: true })
    await fs.appendFile(join(dir, 'enquiries.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
  } catch (err) {
    console.error('[chat] failed to write enquiry file', err)
  }
  console.log('[chat] enquiry captured', record)

  await forwardToCrm(record)
  return record.id
}

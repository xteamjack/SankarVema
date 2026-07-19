// ---------------------------------------------------------------------------
// The single "Ask" page serves several intents. Each purpose below carries the
// radio-card copy and the form fields shown. The page selects a purpose from the
// on-page intent selector (and preselects it from the ?intent=<key> query param).
//
// Mirrors the ZettaMine site's data-driven contact model (data/contactPurposes.ts
// + components/ContactForm.vue), so both sites post to the same CRM intake the
// same way. Voice: dash-clean, no em or en dashes in any rendered string.
// ---------------------------------------------------------------------------

export type FieldType = 'text' | 'email' | 'textarea' | 'select'

export interface ContactField {
  /** key on the form model, and the key POSTed to the CRM */
  key: string
  label: string
  type: FieldType
  placeholder?: string
  /** blocks submit when empty (email is always validated for shape) */
  required?: boolean
  /** renders a muted "(optional)" hint next to the label */
  optional?: boolean
  /** half-width in the two-column grid; full-width fields span both columns */
  half?: boolean
  /** rows for a textarea */
  rows?: number
  /** options for a select (the empty prompt is added automatically) */
  options?: string[]
}

export interface ContactPurpose {
  /** stable key used in the ?intent= query param and the CRM `purpose` field */
  key: string
  /** short label for the intent card and the CRM `interest` tag */
  label: string
  /** one-line description under the label on the intent card */
  blurb: string
  submitLabel: string
  sendingLabel?: string
  fields: ContactField[]
}

// Shared building blocks so the intents stay consistent.
const nameField: ContactField = { key: 'name', label: 'Your name', type: 'text', placeholder: 'Jane Doe', required: true, half: true }
const emailField: ContactField = { key: 'email', label: 'Email', type: 'email', placeholder: 'jane@acme.com', required: true, half: true }
const companyField: ContactField = { key: 'company', label: 'Organization', type: 'text', placeholder: 'Acme Inc.', optional: true }
function messageField(placeholder: string): ContactField {
  return { key: 'message', label: "A few lines on what you're working on", type: 'textarea', rows: 5, required: true, placeholder }
}

export const contactPurposes: ContactPurpose[] = [
  {
    key: 'advisory',
    label: 'Enterprise advisory',
    blurb: 'Architecture review or fractional Chief AI Architect.',
    submitLabel: 'Send message',
    fields: [nameField, emailField, companyField, messageField('What you are building, where you are stuck, what good would look like.')],
  },
  {
    key: 'mentorship',
    label: 'Founder mentorship',
    blurb: 'Early-stage, AI-native product. Applying to the cohort.',
    submitLabel: 'Apply to the cohort',
    fields: [nameField, emailField, companyField, messageField('What you are building, your stage, and where you want a second pair of eyes.')],
  },
  {
    key: 'diligence',
    label: 'Technical due diligence',
    blurb: 'A second opinion on an AI-heavy investment.',
    submitLabel: 'Request diligence',
    fields: [nameField, emailField, companyField, messageField('The target, the thesis, and the technical questions you need answered.')],
  },
  {
    key: 'speaking',
    label: 'Speaking or writing',
    blurb: 'A talk, podcast, or commissioned essay.',
    submitLabel: 'Send the invite',
    fields: [nameField, emailField, companyField, messageField('The event or publication, the audience, the format and the date.')],
  },
  {
    key: 'other',
    label: 'Something else',
    blurb: 'Anything that does not fit the boxes above.',
    submitLabel: 'Send message',
    fields: [nameField, emailField, companyField, messageField('Tell me what is on your mind.')],
  },
]

export const defaultPurpose = contactPurposes[0]!

export function resolvePurpose(key?: string | null): ContactPurpose {
  return contactPurposes.find((p) => p.key === key) ?? defaultPurpose
}

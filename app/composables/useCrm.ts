/**
 * Resolve the CRM base URL for the ask/contact form.
 *
 * Two deployment shapes, one build:
 *  - Azure / SSR: the CRM (leads-service) is reverse-proxied SAME-ORIGIN under
 *    the `/crm` slug on whichever host serves this site (e.g. guildtrek.com when
 *    served at /sankarvema/). We read `useRequestURL().origin` so a single build
 *    adapts to the host, with no CORS. The rehost middleware
 *    (server/middleware/00.rehost.global.ts) makes the SSR origin the public host.
 *  - GitHub Pages (static, no backend): `NUXT_PUBLIC_CRM_URL` is baked in and
 *    overrides everything, pointing the ask form cross-origin at the CRM.
 *
 * The ask form POSTs to `<crmUrl>/api/public/queries` (see ContactForm.vue).
 */
export function useCrm() {
  const override = String(useRuntimeConfig().public.crmUrl || '').trim().replace(/\/+$/, '')

  let base = override
  if (!base) {
    try {
      base = `${useRequestURL().origin}/crm`
    } catch {
      base = ''
    }
  }

  return {
    /** CRM base URL, e.g. https://guildtrek.com/crm */
    url: base,
    /** True when a CRM endpoint is configured; the form disables submit otherwise. */
    configured: !!base,
    link: (path = '') => `${base}${path.startsWith('/') ? path : `/${path}`}`,
  }
}

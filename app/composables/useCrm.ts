/**
 * Resolve the CRM base URL for the ask/contact form.
 *
 * The site is a static GitHub Pages build with no backend of its own, so the
 * ask form POSTs cross-origin to the CRM's public queries intake
 * (`<crmUrl>/api/public/queries`). The base comes from
 * `runtimeConfig.public.crmUrl`, baked from NUXT_PUBLIC_CRM_URL at build time.
 *
 * NOTE: resolving this from the config server's `apps.crm` entry (the SANS way)
 * is deferred as a larger architecture change; for now it stays a build-time env.
 */
export function useCrm() {
  const base = String(useRuntimeConfig().public.crmUrl || '').trim().replace(/\/+$/, '')
  return {
    url: base,
    /** True when a CRM endpoint is configured; the form disables submit otherwise. */
    configured: !!base,
    link: (path = '') => `${base}${path.startsWith('/') ? path : `/${path}`}`,
  }
}

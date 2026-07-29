/**
 * Rehost the request from X-Forwarded-Host — MUST run before any handler that
 * reads the request URL (`00.` prefix keeps it first in server-middleware order).
 *
 * This standalone marketing site does NOT extend n_g_m_nuxt_libs/libs, so it does
 * not inherit that layer's copy of this middleware — hence a local copy (mirrors
 * n_dh_w_fe_corp/gt).
 *
 * WHY: behind the ACA gateway, the proxy rewrites the HTTP Host to the app's
 * INTERNAL FQDN (`<app>.internal.<acaEnv>`) for ACA internal-ingress routing,
 * which is browser-unreachable. Anything built from `useRequestURL().origin`
 * server-side (here: useCrm() → the same-origin /crm base URL) then points at the
 * internal FQDN and leaks into the SSR HTML. The gateway also sends
 * X-Forwarded-Host = the real public host; rewriting req.headers.host from it
 * makes useRequestURL() resolve the public origin. Client-side is a no-op.
 */
export default defineEventHandler((event) => {
    const xfh = event.node.req.headers['x-forwarded-host'];
    if (!xfh) return;
    const host = (Array.isArray(xfh) ? xfh[0] : String(xfh)).split(',')[0].trim();
    if (host) event.node.req.headers.host = host;
});

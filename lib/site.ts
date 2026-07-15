// Deployment/infrastructure config — which origin this build is served
// from. Not content, so it stays separate from Site Settings (siteTitle,
// siteDescription, etc. — see cms/services/siteSettings.ts, the single
// source of truth for site-wide content).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

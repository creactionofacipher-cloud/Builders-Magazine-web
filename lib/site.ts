// Deployment/infrastructure config — which origin this build is served
// from. Not content, so it stays separate from Site Settings (siteTitle,
// siteDescription, etc. — see cms/services/siteSettings.ts, the single
// source of truth for site-wide content).
//
// `||`, not `??`: an .env file with the key present but set to an empty
// string (NEXT_PUBLIC_SITE_URL=) is "" at runtime, not undefined — `??`
// wouldn't fall back to the default and `new URL("")` throws.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

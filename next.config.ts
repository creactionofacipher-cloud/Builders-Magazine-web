import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { IMAGE_QUALITY_PRESETS } from "./lib/imageConfig";

// Origins allowed to embed this site in an iframe — Sanity's Presentation
// tool (studio/sanity.config.ts's presentationTool) does exactly that for
// live draft preview, loading the frontend inside an iframe hosted on the
// *Studio's* origin, not this site's own. A plain `X-Frame-Options:
// SAMEORIGIN` (tried first) blocks that outright — "Unable to connect" in
// Presentation with nothing more specific in the browser console is what
// that looks like. `frame-ancestors` (CSP) is the fix: unlike
// X-Frame-Options it can allowlist specific *other* origins instead of
// only same-origin-or-nothing. Update this list if the Studio ends up
// hosted somewhere other than these two (see README.md's "Deploying the
// Studio" section) — a self-hosted Studio domain needs to be added here
// too, or preview breaks there the same way.
const FRAME_ANCESTORS = [
  "'self'",
  "http://localhost:3333", // local Studio dev server
  "https://*.sanity.studio", // Sanity-hosted Studio (`sanity deploy`)
].join(" ");

// Baseline security headers, applied to every route. Deliberately not a
// full Content-Security-Policy beyond frame-ancestors above: this app
// embeds third-party iframes (YouTube/Vimeo via components/ui/Embed.tsx)
// that a stricter CSP would need real testing against before shipping.
// The other headers here don't have that risk: they're widely-recommended,
// low-controversy defaults with no legitimate reason for this site to opt
// out of any of them.
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: `frame-ancestors ${FRAME_ANCESTORS}` },
  // Stops browsers from MIME-sniffing a response into executing as a
  // different content-type than declared.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sends the full URL to same-origin requests/navigations, only the
  // origin (no path/query) cross-origin — avoids leaking article
  // slugs/search queries to third-party embed/link targets while still
  // giving same-site analytics a complete referrer.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Explicitly opts out of browser features this site never uses.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    // AVIF first — Next serves whichever format the requester's Accept
    // header supports, checked in this order. Defaults to WebP-only
    // otherwise.
    formats: ["image/avif", "image/webp"],
    // Optimized variants are immutable for a given source+params, so cache
    // them at the edge far longer than the 60s default.
    minimumCacheTTL: 2678400,
    // Every `quality` value next/image is allowed to request — Next.js
    // otherwise defaults to allowing only [75], warning (and in a future
    // version, presumably rejecting) any other value. Derived from
    // lib/imageConfig.ts's IMAGE_QUALITY_PRESETS instead of a separate
    // hardcoded list, so a new preset added there can never silently
    // drift out of sync with what's actually allowed here.
    qualities: Object.values(IMAGE_QUALITY_PRESETS),
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

// Disabled by default (a plain pass-through) — set ANALYZE=true to wrap
// the build with the bundle-report generator instead. Every other build
// is byte-for-byte the same config as before this line existed.
// @next/bundle-analyzer instruments webpack, not Turbopack (this app's
// default `next build` bundler) — hence `npm run analyze` passing
// `--webpack` for that one invocation only; plain `next build`/`npm run
// build` stay on Turbopack, completely unaffected by any of this.
const analyzeBundle = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

export default analyzeBundle(nextConfig);

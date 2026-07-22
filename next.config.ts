import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Baseline security headers, applied to every route. Deliberately not a
// strict Content-Security-Policy: this app embeds third-party iframes
// (YouTube/Vimeo via components/ui/Embed.tsx) and Sanity's visual-editing
// overlay talks to the Studio's origin in draft mode — a hand-written CSP
// covering both correctly needs real testing against every embed
// provider rather than shipping one unverified. These four don't have
// that risk: they're widely-recommended, low-controversy defaults with
// no legitimate reason for this site to opt out of any of them.
const SECURITY_HEADERS = [
  // This site has no reason to be framed by another origin — blocks
  // clickjacking. (Not COEP/CSP frame-ancestors, which would need the
  // same embed-compatibility review as a CSP would.)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
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

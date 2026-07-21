import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

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

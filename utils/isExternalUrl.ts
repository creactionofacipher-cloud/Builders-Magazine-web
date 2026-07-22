// Editor-authored URL fields (CTA/Banner's buttonUrl, Bike/Builder
// Spotlight's ctaUrl) can point anywhere — internal site path or an
// external site — so callers can't assume either way the way a
// hardcoded external link (e.g. a social permalink) can. Treated as
// external whenever it's a fully-qualified http(s) URL; a relative path
// ("/ru/...") is treated as internal.
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

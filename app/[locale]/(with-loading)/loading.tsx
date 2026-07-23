import { Container } from "@/components/layout/Container";
import { Text } from "@/components/ui/Text";

// Scoped to the (with-loading) route group — not every page under
// [locale] — deliberately. A loading.tsx wraps its whole subtree in a
// React Suspense boundary, and any notFound() thrown inside a streamed
// (Suspense-wrapped) response can't retroactively downgrade the already-
// sent 200 status to a real 404 (confirmed live, 2026-07: a genuinely
// nonexistent /magazine/[slug] returned HTTP 200 with the not-found page
// body once dynamicParams was enabled — see app/[locale]/layout.tsx).
// Every [slug] detail route that can 404 (stories, magazine,
// builders-cup, buy/merchandise, p) lives outside this group so it
// renders without an inherited Suspense boundary and keeps a correct
// status code; only the listing/static pages that never call notFound()
// opt into the loading UI here.
export default function Loading() {
  return (
    <Container className="py-[var(--spacing-section)]">
      <Text variant="muted">Загрузка…</Text>
    </Container>
  );
}

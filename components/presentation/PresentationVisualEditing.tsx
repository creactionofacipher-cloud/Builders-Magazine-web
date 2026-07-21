"use client";

import { VisualEditing } from "@sanity/visual-editing/react";

// Establishes the postMessage connection Sanity's Presentation tool
// iframe expects (see studio/sanity.config.ts's presentationTool) —
// without this, the in-Studio preview panel shows "Unable to connect to
// visual editing" even though the page itself renders fine (confirmed:
// draft content already loads correctly via app/api/draft-mode/enable +
// cms/sanity/client.ts's draft-aware sanityFetch — this component only
// adds the handshake, not the data). Rendered only when Draft Mode is on
// (see app/layout.tsx) so regular visitors never load this.
export function PresentationVisualEditing() {
  // portal: true — overlay UI mounts into its own DOM node instead of
  // inline in the page tree, so it can't interfere with this site's own
  // CSS (grid/flex layouts, stacking contexts, etc).
  return <VisualEditing portal />;
}

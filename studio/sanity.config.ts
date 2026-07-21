import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool, defineLocations } from "sanity/presentation";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";
import { getFrontendOrigin, resolvePreviewPath } from "./lib/previewUrl";
import { openPreviewAction } from "./lib/openPreviewAction";
import { PresentationPreviewHeader } from "./components/presentation/PresentationPreviewHeader";

// Document types with exactly one fixed-ID instance (see structure.ts).
const SINGLETON_TYPES = new Set(["siteSettings"]);

// One resolver per previewable document type (studio/lib/previewUrl.ts's
// PREVIEWABLE_TYPES) — each tells the Presentation tool which single
// frontend URL a given document/slug maps to, via the same
// resolvePreviewPath() the "Open Preview" document action also calls, so
// the two can never disagree about where a document actually lives.
const storyLocation = defineLocations({
  select: { title: "title", slug: "slug.current" },
  resolve: (doc) => ({
    locations: [
      {
        title: doc?.title || "Untitled",
        href: resolvePreviewPath("story", doc?.slug ?? ""),
      },
    ],
  }),
});

const issueLocation = defineLocations({
  select: { title: "title", slug: "slug.current" },
  resolve: (doc) => ({
    locations: [
      {
        title: doc?.title || "Untitled",
        href: resolvePreviewPath("issue", doc?.slug ?? ""),
      },
    ],
  }),
});

const buildersCupLocation = defineLocations({
  select: { title: "name", slug: "slug.current" },
  resolve: (doc) => ({
    locations: [
      {
        title: doc?.title || "Untitled",
        href: resolvePreviewPath("buildersCup", doc?.slug ?? ""),
      },
    ],
  }),
});

const productLocation = defineLocations({
  select: { title: "name", slug: "slug.current" },
  resolve: (doc) => ({
    locations: [
      {
        title: doc?.title || "Untitled",
        href: resolvePreviewPath("product", doc?.slug ?? ""),
      },
    ],
  }),
});

export default defineConfig({
  name: "default",
  title: "Builders Magazine",

  projectId: "l1slax0i",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    // Live article preview — draft content visible without publishing,
    // rendered by the real Next.js pages (no second renderer; see
    // app/api/draft-mode/enable, which the previewMode.enable URL below
    // hits to turn on Next.js Draft Mode before the iframe loads).
    presentationTool({
      previewUrl: {
        origin: getFrontendOrigin(),
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        locations: {
          story: storyLocation,
          issue: issueLocation,
          buildersCup: buildersCupLocation,
          product: productLocation,
        },
      },
      components: {
        // Adds the desktop/tablet/phone device switcher (see
        // studio/components/presentation/DeviceSwitcher.tsx) as a second
        // toolbar row under Presentation's own header, without replacing
        // any of Presentation's existing header UI.
        unstable_header: { component: PresentationPreviewHeader },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons are only reachable through their fixed-ID entry in
    // structure.ts, not the global "create new document" menu.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((template) => !SINGLETON_TYPES.has(template.templateId));
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      // A singleton can't be duplicated (would recreate this exact bug)
      // or deleted (every page depends on it existing).
      const withoutSingletonActions = SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => action !== "duplicate" && action !== "delete")
        : prev;
      // openPreviewAction itself no-ops (returns null) for any schema
      // type outside PREVIEWABLE_TYPES, so it's safe to always append —
      // no per-type branching needed here.
      return [...withoutSingletonActions, openPreviewAction];
    },
  },
});

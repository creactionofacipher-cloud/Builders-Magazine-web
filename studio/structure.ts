import type { StructureResolver } from "sanity/structure";

// Site Settings is a singleton fetched by fixed _id ("siteSettings") — see
// cms/queries/siteSettings.ts in the main app. Studio's default document
// list lets editors create arbitrary new "Site Settings" documents with
// random IDs, which the app's query silently never finds (it falls back to
// mock data instead — see cms/services/siteSettings.ts). This structure
// pins Site Settings to a single fixed-ID entry so a duplicate can't be
// created through the desk UI.
const SINGLETON_TYPES = new Set(["siteSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
      ),
    ]);

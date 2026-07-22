import type { StructureResolver } from "sanity/structure";

// Site Settings and Home Page are both singletons fetched by a fixed _id
// ("siteSettings" / "homePage" — see cms/queries/siteSettings.ts and
// cms/queries/homepage.ts in the main app). Studio's default document
// list lets editors create arbitrary new documents of these types with
// random IDs, which the app's query silently never finds (it falls back
// to mock data instead — see cms/services/siteSettings.ts and
// cms/services/homepage.ts). This structure pins both to a single
// fixed-ID entry so a duplicate can't be created through the desk UI.
const SINGLETON_TYPES = new Set(["siteSettings", "homePage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
      ),
    ]);

import { mediaAsset } from "./mediaAsset";
import { person } from "./person";
import { issue } from "./issue";
import { story } from "./story";
import { bike } from "./bike";
import { builder } from "./builder";
import { buildersCup } from "./buildersCup";
import { product } from "./product";
import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { landingPage } from "./landingPage";

// Consumed by a real sanity.config.ts's schema.types once a Studio
// project exists — not executed by this Next.js app.
export const schemaTypes = [
  mediaAsset,
  person,
  issue,
  story,
  bike,
  builder,
  buildersCup,
  product,
  siteSettings,
  homePage,
  landingPage,
];

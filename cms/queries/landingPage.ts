import { layoutBlocksField } from "./layoutBlocks";

const landingPageFields = `{
  "id": _id,
  "slug": slug.current,
  title,
  status,
  ${layoutBlocksField("blocks")}
}`;

export const ALL_LANDING_PAGES_QUERY = `*[_type == "landingPage"] ${landingPageFields}`;

export const LANDING_PAGE_BY_SLUG_QUERY = `*[_type == "landingPage" && slug.current == $slug][0] ${landingPageFields}`;

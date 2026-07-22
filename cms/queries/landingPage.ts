import { layoutBlocksField } from "./layoutBlocks";

const landingPageFields = `{
  "id": _id,
  "slug": slug.current,
  title,
  status,
  ${layoutBlocksField("blocks")}
}`;

// See cms/queries/story.ts's PUBLISHED_FILTER for why this treats an
// unset status as visible rather than requiring an explicit "published".
const PUBLISHED_FILTER = `(!defined(status) || status == "published")`;

export const ALL_LANDING_PAGES_QUERY = `*[_type == "landingPage" && ${PUBLISHED_FILTER}] ${landingPageFields}`;

export const LANDING_PAGE_BY_SLUG_QUERY = `*[_type == "landingPage" && slug.current == $slug && ${PUBLISHED_FILTER}][0] ${landingPageFields}`;

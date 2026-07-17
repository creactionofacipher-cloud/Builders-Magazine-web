import { bikeProjection } from "./fragments";

// Fuller than builderRefProjection (used when Builder is a nested
// relation elsewhere) — BuilderCard reads projects[0].images[0], so the
// top-level builder fetch needs projects populated with full bike data.
export const ALL_BUILDERS_QUERY = `*[_type == "builder"] {
  "id": _id,
  "slug": slug.current,
  name,
  location,
  "projects": projects[]->${bikeProjection}
}`;

import { builderProjection } from "./fragments";

export const ALL_BUILDERS_QUERY = `*[_type == "builder"] ${builderProjection}`;

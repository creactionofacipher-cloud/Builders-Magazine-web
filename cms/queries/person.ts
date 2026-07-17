import { personProjection } from "./fragments";

export const ALL_PEOPLE_QUERY = `*[_type == "person"] ${personProjection}`;

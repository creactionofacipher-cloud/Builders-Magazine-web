import { bikeProjection } from "./fragments";

export const ALL_BIKES_QUERY = `*[_type == "bike"] ${bikeProjection}`;

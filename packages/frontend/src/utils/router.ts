import type { RouteLocation } from "vue-router";

export const hasQueryParams = (route: RouteLocation) => {
    return !!Object.keys(route.query).length;
};

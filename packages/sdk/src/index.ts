import { MetromApiClient } from "./client/backend";
import { SERVICE_URLS } from "./commons";

export const metromDevelopmentApiClient = new MetromApiClient(
    SERVICE_URLS["development"].metrom,
);
export const metromProductionApiClient = new MetromApiClient(
    SERVICE_URLS["production"].metrom,
);

export { MetromApiClient } from "./client/backend";

export * from "./types/activities";
export * from "./types/campaigns";
export * from "./types/claims";
export * from "./types/commons";
export * from "./types/fee-tokens";
export * from "./types/initialized-ticks";
export * from "./types/kpi-measurements";
export * from "./types/leaderboards";
export * from "./types/liquity-v2";
export * from "./types/pools";
export * from "./types/reward-tokens";

export * from "./commons";
export * from "./utils";

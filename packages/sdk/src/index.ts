import { MetromApiClient } from "./client/backend";
import { Environment, SERVICE_URLS } from "./commons";
export { MetromApiClient } from "./client/backend";

export const METROM_API_CLIENT: Record<Environment, MetromApiClient> = {
    [Environment.Development]: new MetromApiClient(
        SERVICE_URLS["development"].metrom,
    ),
    [Environment.Production]: new MetromApiClient(
        SERVICE_URLS["production"].metrom,
    ),
};

export * from "./types/activities";
export * from "./types/campaigns";
export * from "./types/claims";
export * from "./types/commons";
export * from "./types/fee-tokens";
export * from "./types/fungible-asset";
export * from "./types/initialized-ticks";
export * from "./types/kpi-measurements";
export * from "./types/leaderboards";
export * from "./types/aave-v3";
export * from "./types/liquity-v2";
export * from "./types/pools";
export * from "./types/projects";
export * from "./types/reward-tokens";

export {
    BackendCampaignStatus,
    BackendCampaignType,
    BackendCampaignOrderBy,
} from "./client/types/campaigns";

export * from "./commons";
export * from "./utils";

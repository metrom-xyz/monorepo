import { Environment, SupportedLiquityV2 } from "@metrom-xyz/sdk";

export const LV2_SERVICE_BASE_URLS: Record<
    Environment,
    (protocol: SupportedLiquityV2) => string
> = {
    [Environment.Development]: (protocol) =>
        `https://${protocol}.dev.metrom.xyz/`,
    [Environment.Production]: (protocol) => `https://${protocol}.metrom.xyz/`,
};

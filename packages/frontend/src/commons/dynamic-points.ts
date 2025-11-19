import { Environment, type SupportedProtocol } from "@metrom-xyz/sdk";

export const DYNAMIC_POINTS_BASE_SERVICE_URLS: Record<
    Environment,
    (protocol: SupportedProtocol) => string
> = {
    [Environment.Development]: (protocol) =>
        `https://${protocol}.dev.metrom.xyz/`,
    [Environment.Production]: (protocol) => `https://${protocol}.metrom.xyz/`,
};

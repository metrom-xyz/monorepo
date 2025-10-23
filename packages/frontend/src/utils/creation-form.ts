import { DistributablesType } from "@metrom-xyz/sdk";
import type { CampaignPayloadDistributables } from "../types/campaign";

export function validateDistributables(
    distributables: CampaignPayloadDistributables,
) {
    if (
        distributables.type === DistributablesType.FixedPoints &&
        (!distributables.fee || !distributables.type)
    )
        return false;
    if (
        distributables.type === DistributablesType.Tokens &&
        (!distributables.tokens || distributables.tokens.length === 0)
    )
        return false;

    return true;
}

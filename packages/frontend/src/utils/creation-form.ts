import { DistributablesType } from "@metrom-xyz/sdk";
import type {
    CampaignPayloadDistributables,
    CampaignPayloadFixedDistribution,
    CampaignPayloadKpiDistribution,
} from "../types/campaign";

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

export function validateDistributions(
    kpiDistribution?: CampaignPayloadKpiDistribution,
    fixedDistribution?: CampaignPayloadFixedDistribution,
) {
    if (kpiDistribution && fixedDistribution) return false;
    if (kpiDistribution && !kpiDistribution.goal) return false;
    if (fixedDistribution && !fixedDistribution.apr) return false;

    return true;
}

export function getUsdBudgetForFixedApr(
    referenceTvl: number,
    bufferPercentage: number,
    daysDuration: number,
    apr?: number,
) {
    if (!apr) return 0;
    return (
        referenceTvl *
        (apr / 100) *
        (daysDuration / 365) *
        (1 + bufferPercentage / 100)
    );
}

import type { HookBaseParams } from "@/src/types/hooks";
import { useChainType } from "../useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useCampaignDurationLimitsEvm } from "./useCampaignDurationLimitsEvm";
import { useCampaignDurationLimitsMvm } from "./useCampaignDurationLimitsMvm";
import { useCampaignDurationLimitsSvm } from "./useCampaignDurationLimitsSvm";
import { useCampaignDurationLimitsSui } from "./useCampaignDurationLimitsSui";

export interface CampaignDurationLimits {
    minimumSeconds: number;
    maximumSeconds: number;
}

export type UseCampaignDurationLimitsParams = HookBaseParams;

export interface UseCampaignDurationReturnValue {
    loading: boolean;
    limits?: CampaignDurationLimits;
}

export function useCampaignDurationLimits(
    params: UseCampaignDurationLimitsParams = {},
): UseCampaignDurationReturnValue {
    const chainType = useChainType();

    const limitsEvm = useCampaignDurationLimitsEvm({
        ...params,
        enabled: chainType === ChainType.Evm,
    });
    const limitsMvm = useCampaignDurationLimitsMvm({
        ...params,
        enabled: chainType === ChainType.Aptos,
    });
    const limitsSvm = useCampaignDurationLimitsSvm({
        ...params,
        enabled: chainType === ChainType.Svm,
    });
    const limitsSui = useCampaignDurationLimitsSui({
        ...params,
        enabled: chainType === ChainType.Sui,
    });

    switch (chainType) {
        case ChainType.Evm:
            return limitsEvm;
        case ChainType.Aptos:
            return limitsMvm;
        case ChainType.Svm:
            return limitsSvm;
        case ChainType.Sui:
            return limitsSui;
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useCampaignDurationLimits`,
            );
    }
}

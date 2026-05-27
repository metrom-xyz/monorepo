import type { HookBaseParams } from "@/src/types/hooks";
import { useChainWithType } from "./useChainWithType";
import { useChainData } from "./useChainData";
import { useReadContracts } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useViewModule } from "@aptos-labs/react";
import { useMemo } from "react";
import { useSolanaMetromProgramState } from "./useSolanaMetromProgramState";
import { ChainType } from "@metrom-xyz/sdk";

export interface CampaignDurationLimits {
    minimumSeconds: number;
    maximumSeconds: number;
}

export type UseCampaignDurationLimitsParams = HookBaseParams;

export interface UseCampaignDurationReturnValue {
    loading: boolean;
    limits?: CampaignDurationLimits;
}

export function useCampaignDurationLimits({
    enabled,
}: UseCampaignDurationLimitsParams = {}): UseCampaignDurationReturnValue {
    const { id: chainId, type: chainType } = useChainWithType();
    const chainData = useChainData({ chainId });

    const limitsEvm = useReadContracts({
        contracts: [
            {
                abi: metromAbi,
                address: chainData?.metromContract.address,
                functionName: "minimumCampaignDuration",
            },
            {
                abi: metromAbi,
                address: chainData?.metromContract.address,
                functionName: "maximumCampaignDuration",
            },
        ],
        query: {
            enabled: chainType === ChainType.Evm && !!chainData && enabled,
        },
    });

    const minLimitMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::minimum_campaign_duration`,
        },
        enabled: chainType === ChainType.Aptos && !!chainData && enabled,
    });
    const maxLimitMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::maximum_campaign_duration`,
        },
        enabled: chainType === ChainType.Aptos && !!chainData && enabled,
    });

    const metromProgramState = useSolanaMetromProgramState({
        enabled: chainType === ChainType.Svm && !!chainData && enabled,
    });

    const loading =
        limitsEvm.isLoading ||
        minLimitMvm.isLoading ||
        maxLimitMvm.isLoading ||
        metromProgramState.loading;

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (loading) return undefined;

        if (
            chainType === ChainType.Aptos &&
            minLimitMvm.data &&
            maxLimitMvm.data
        )
            return {
                minimumSeconds: Number(minLimitMvm.data[0]),
                maximumSeconds: Number(maxLimitMvm.data[0]),
            };
        if (chainType === ChainType.Evm && limitsEvm.data)
            return {
                minimumSeconds: Number(limitsEvm.data[0].result),
                maximumSeconds: Number(limitsEvm.data[1].result),
            };
        if (chainType === ChainType.Svm && metromProgramState.data)
            return {
                minimumSeconds: metromProgramState.data.minimumCampaignDuration,
                maximumSeconds: metromProgramState.data.maximumCampaignDuration,
            };

        return undefined;
    }, [
        chainType,
        loading,
        limitsEvm.data,
        minLimitMvm.data,
        maxLimitMvm.data,
        metromProgramState.data,
    ]);

    return {
        loading,
        limits,
    };
}

import type { HookBaseParams } from "@/src/types/hooks";
import { useChainWithType } from "../useChainWithType";
import { useChainData } from "../useChainData";
import { useSolanaMetromProgramState } from "../useSolanaMetromProgramState";
import { useMemo } from "react";
import type {
    CampaignDurationLimits,
    UseCampaignDurationReturnValue,
} from ".";

export function useCampaignDurationLimitsSvm({
    enabled = true,
}: HookBaseParams = {}): UseCampaignDurationReturnValue {
    const { id: chainId } = useChainWithType();
    const chainData = useChainData({ chainId });

    const metromProgramState = useSolanaMetromProgramState({
        enabled: !!chainData && enabled,
    });

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (metromProgramState.loading || !metromProgramState.data)
            return undefined;
        return {
            minimumSeconds: metromProgramState.data.minimumCampaignDuration,
            maximumSeconds: metromProgramState.data.maximumCampaignDuration,
        };
    }, [metromProgramState.data, metromProgramState.loading]);

    return { loading: metromProgramState.loading, limits };
}

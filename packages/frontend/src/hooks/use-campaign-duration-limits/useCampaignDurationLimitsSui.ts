import type { HookBaseParams } from "@/src/types/hooks";
import { useChainWithType } from "../useChainWithType";
import { useChainData } from "../useChainData";
import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import {
    minimumCampaignDuration,
    maximumCampaignDuration,
} from "@metrom-xyz/sui-contracts/client";
import type { UseCampaignDurationReturnValue } from ".";

export function useCampaignDurationLimitsSui({
    enabled = true,
}: HookBaseParams = {}): UseCampaignDurationReturnValue {
    const { id: chainId } = useChainWithType();
    const chainData = useChainData({ chainId });
    const client = useCurrentClient();

    const { data: limits, isLoading } = useQuery({
        queryKey: [
            "campaign-duration-limits-sui",
            chainId,
            chainData?.metromContract.address,
            chainData?.metromContract.stateAddress,
        ],
        queryFn: async () => {
            const tx = new Transaction();

            minimumCampaignDuration({
                package: chainData!.metromContract.address,
                arguments: { state: chainData!.metromContract.stateAddress! },
            })(tx);

            maximumCampaignDuration({
                package: chainData!.metromContract.address,
                arguments: { state: chainData!.metromContract.stateAddress! },
            })(tx);

            const result = await client.simulateTransaction({
                transaction: tx,
                checksEnabled: false,
                include: { commandResults: true },
            });

            const minBytes = result.commandResults?.[0]?.returnValues?.[0]?.bcs;
            const maxBytes = result.commandResults?.[1]?.returnValues?.[0]?.bcs;
            if (!minBytes || !maxBytes) return null;

            return {
                minimumSeconds: Number(bcs.u64().parse(minBytes)),
                maximumSeconds: Number(bcs.u64().parse(maxBytes)),
            };
        },
        enabled: !!chainData?.metromContract.stateAddress && enabled,
    });

    return {
        loading: isLoading,
        limits: limits ?? undefined,
    };
}

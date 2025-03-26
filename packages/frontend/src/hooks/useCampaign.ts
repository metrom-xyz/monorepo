import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Hex } from "viem";
import { CHAIN_DATA, METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName } from "../utils/campaign";
import { Campaign } from "../types/common";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";

interface UseCampaignParams extends HookBaseParams {
    chainId?: SupportedChain;
    id?: Hex;
}

type QueryKey = [string, SupportedChain | undefined, Hex | undefined];

export function useCampaign({
    id,
    chainId,
    enabled = true,
}: UseCampaignParams = {}) {
    const t = useTranslations();

    const { data: campaign, isPending: loading } = useQuery({
        queryKey: ["campaign", chainId, id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, id] = queryKey as QueryKey;
            if (!chainId || !id) return null;

            try {
                const campaign = await METROM_API_CLIENT.fetchCampaign({
                    chainId,
                    id,
                });
                return new Campaign(
                    campaign,
                    CHAIN_DATA[chainId],
                    getCampaignName(t, campaign),
                );
            } catch (error) {
                console.error(
                    `Could not fetch campaign ${id} for chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!chainId && !!id,
    });

    return {
        loading,
        campaign: campaign || undefined,
    };
}

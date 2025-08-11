import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Hex } from "viem";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName } from "../utils/campaign";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";
import { Campaign } from "../types/campaign";
import { getChainData } from "../utils/chain";
import type { ChainType } from "@metrom-xyz/sdk";

interface UseCampaignParams extends HookBaseParams {
    chainId?: SupportedChain;
    chainType?: ChainType;
    id?: Hex;
}

type QueryKey = [
    string,
    SupportedChain | undefined,
    ChainType | undefined,
    Hex | undefined,
];

export function useCampaign({
    id,
    chainId,
    chainType,
    enabled = true,
}: UseCampaignParams = {}) {
    const t = useTranslations();

    const { data: campaign, isPending: loading } = useQuery({
        queryKey: ["campaign", chainId, chainType, id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType, id] = queryKey as QueryKey;
            if (!chainId || !chainType || !id) return null;

            try {
                const campaign = await METROM_API_CLIENT.fetchCampaign({
                    chainId,
                    chainType,
                    id,
                });
                return new Campaign(
                    campaign,
                    getCampaignName(t, campaign),
                    getChainData(chainId),
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
        enabled: enabled && !!chainId && !!chainType && !!id,
    });

    return {
        loading,
        campaign: campaign || undefined,
    };
}

import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Hex } from "viem";
import { CHAIN_DATA, METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName } from "../utils/campaign";
import { useTranslations } from "next-intl";
import { Campaign } from "../types/common";

export function useCampaign(
    chainId?: SupportedChain,
    id?: Hex,
): {
    loading: boolean;
    campaign?: Campaign;
} {
    const t = useTranslations();

    const { data: campaign, isPending: loading } = useQuery({
        queryKey: ["campaign", chainId, id],
        queryFn: async ({ queryKey }) => {
            const chainId = queryKey[1] as SupportedChain;
            const id = queryKey[2] as Hex;
            if (!chainId || !id) return undefined;

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
        enabled: !!chainId && !!id,
    });

    return {
        loading,
        campaign,
    };
}

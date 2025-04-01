import { CHAIN_DATA, METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName } from "../utils/campaign";
import { Campaign } from "../types/common";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";

interface UseCampaignsParams extends HookBaseParams {}

export function useCampaigns({ enabled = true }: UseCampaignsParams = {}): {
    loading: boolean;
    campaigns?: Campaign[];
} {
    const t = useTranslations();

    const { data: campaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns"],
        queryFn: async () => {
            try {
                const campaigns = await METROM_API_CLIENT.fetchCampaigns();
                return campaigns
                    .map((campaign) => {
                        return new Campaign(
                            campaign,
                            CHAIN_DATA[campaign.chainId as SupportedChain],
                            getCampaignName(t, campaign),
                        );
                    })
                    .sort((a, b) => a.createdAt - b.createdAt);
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`);
                throw error;
            }
        },
        enabled,
    });

    return {
        loading,
        campaigns,
    };
}

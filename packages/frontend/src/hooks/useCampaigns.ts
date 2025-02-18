import { CHAIN_DATA, metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getCampaignName } from "../utils/campaign";
import { Campaign } from "../types";
import type { SupportedChain } from "@metrom-xyz/contracts";

export function useCampaigns(): {
    loading: boolean;
    campaigns?: Campaign[];
} {
    const t = useTranslations();

    const { data: campaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns"],
        queryFn: async () => {
            try {
                const campaigns = await metromApiClient.fetchCampaigns();
                return campaigns.map((campaign) => {
                    return new Campaign(
                        campaign,
                        CHAIN_DATA[campaign.chainId as SupportedChain],
                        getCampaignName(t, campaign),
                    );
                });
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`);
                throw error;
            }
        },
    });

    return {
        loading,
        campaigns,
    };
}

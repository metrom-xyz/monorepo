import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getCampaignName } from "../utils/campaign";
import { NamedCampaign } from "../types";

export function useCampaigns(): {
    loading: boolean;
    campaigns?: NamedCampaign[];
} {
    const t = useTranslations();

    const { data: campaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns"],
        queryFn: async () => {
            try {
                const campaigns = await metromApiClient.fetchCampaigns();
                return campaigns.map((campaign) => {
                    return new NamedCampaign(
                        campaign,
                        getCampaignName(t, campaign),
                    );
                });
            } catch (error) {
                throw new Error(`Could not fetch campaigns: ${error}`);
            }
        },
    });

    return {
        loading,
        campaigns,
    };
}

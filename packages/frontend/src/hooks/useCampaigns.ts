import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName } from "../utils/campaign";
import { Campaign } from "../types/campaign";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";
import { getChainData } from "../utils/chain";
import type { SupportedDex } from "@metrom-xyz/sdk";
import type { CampaignStatus } from "@metrom-xyz/chains";

interface UseCampaignsParams extends HookBaseParams {
    chainId?: number;
    dex?: SupportedDex;
    status?: CampaignStatus;
}

export function useCampaigns({
    chainId,
    dex,
    status,
    enabled = true,
}: UseCampaignsParams = {}): {
    loading: boolean;
    campaigns?: Campaign[];
} {
    const t = useTranslations();

    const { data: campaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns", chainId, dex, status],
        queryFn: async () => {
            try {
                const campaigns = await METROM_API_CLIENT.fetchCampaigns({
                    chainId,
                    dex,
                    status,
                });
                return campaigns
                    .map((campaign) => {
                        return new Campaign(
                            campaign,
                            getCampaignName(t, campaign),
                            getChainData(campaign.chainId),
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

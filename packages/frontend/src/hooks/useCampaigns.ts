import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { metromApiClient } from "../commons";
import { type Campaign } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";
import { getCampaignName } from "../utils/campaign";

export interface NamedCampaign extends Campaign {
    name: string;
}

export function useCampaigns(): {
    loading: boolean;
    campaigns: NamedCampaign[];
} {
    const chainId: SupportedChain = useChainId();

    const [campaigns, setCampaigns] = useState<NamedCampaign[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setCampaigns([]);

            try {
                if (!cancelled) setLoading(true);
                const fetchedCampaigns = await metromApiClient.fetchCampaigns();
                const namedCampaigns: NamedCampaign[] = [];
                for (const campaign of fetchedCampaigns) {
                    namedCampaigns.push({
                        ...campaign,
                        name: getCampaignName(campaign),
                    });
                }
                if (!cancelled) setCampaigns(namedCampaigns);
            } catch (error) {
                console.error(
                    `Could not fetch campaigns for chain with id ${chainId}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [chainId]);

    return {
        loading,
        campaigns,
    };
}

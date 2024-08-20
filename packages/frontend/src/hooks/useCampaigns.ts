import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { CHAIN_DATA } from "../commons";
import { type Campaign } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";

export function useCampaigns(
    pageNumber: number,
    pageSize: number,
    asc?: boolean,
): {
    loading: boolean;
    campaigns: Campaign[];
} {
    const chainId: SupportedChain = useChainId();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setCampaigns([]);

            try {
                if (!cancelled) setLoading(true);
                const { campaigns } = await CHAIN_DATA[
                    chainId
                ].metromApiClient.fetchCampaigns({
                    pageNumber,
                    pageSize,
                    asc,
                });
                if (!cancelled) setCampaigns(campaigns);
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
    }, [chainId, asc, pageNumber, pageSize]);

    return {
        loading,
        campaigns,
    };
}

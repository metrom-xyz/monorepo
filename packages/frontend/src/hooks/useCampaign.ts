import type { SupportedChain } from "@metrom-xyz/contracts";
import { type Campaign } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";
import type { Address } from "viem";
import { metromApiClient, SUPPORTED_AMM_SLUG_TO_NAME } from "../commons";

export interface NamedCampaign extends Campaign {
    name: string;
}

export function useCampaign(
    chainId: SupportedChain,
    id: Address,
): {
    loading: boolean;
    campaign?: NamedCampaign;
} {
    const [campaign, setCampaign] = useState<NamedCampaign>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setCampaign(undefined);

            try {
                if (!cancelled) setLoading(true);
                const campaign = await metromApiClient.fetchCampaign({
                    chainId,
                    id,
                });

                if (!cancelled)
                    setCampaign({
                        ...campaign,
                        name: `${SUPPORTED_AMM_SLUG_TO_NAME[campaign.pool.amm] || "-"} ${campaign.pool.token0.symbol} / ${campaign.pool.token1.symbol}`,
                    });
            } catch (error) {
                console.error(
                    `Could not fetch campaign ${id} for chain with id ${chainId}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [chainId, id]);

    return {
        loading,
        campaign,
    };
}

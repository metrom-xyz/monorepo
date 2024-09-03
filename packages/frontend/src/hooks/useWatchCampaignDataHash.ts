import { useEffect, useState } from "react";
import type { Hex } from "viem";
import { query } from "../utils/subgraph";
import type { Campaign } from "@metrom-xyz/sdk";
import { useWatchRewardDistributionEvent } from "./useWatchRewardDistributionEvent";
import { useChainData } from "./useChainData";

export interface GetCampaignDataResult {
    campaign: {
        data: Hex;
    } | null;
}

export const GetCampaignData = `
    query getCampaignData($id: ID!) {
        campaign(id: $id) {
            data
        }
    }
`;

// TODO: move fetch to a subgraph client in the sdk?
export function useWatchCampaignDataHash(campaign?: Campaign): {
    loading: boolean;
    hash?: Hex;
} {
    const [hash, setHash] = useState<Hex>();
    const [loading, setLoading] = useState(false);

    const chainData = useChainData();
    const { distribution } = useWatchRewardDistributionEvent(campaign);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setHash(undefined);

            if (!campaign) return;

            try {
                if (!cancelled) setLoading(true);
                const response = await query<GetCampaignDataResult>(
                    chainData.metromSubgraphUrl,
                    GetCampaignData,
                    { id: campaign.id },
                );

                if (!response.campaign) return;

                if (!cancelled) setHash(response.campaign.data);
            } catch (error) {
                console.error(
                    `Could not fetch data hash for campaign with id ${campaign.id} and chain with id ${campaign.chainId}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
    }, [campaign, chainData.metromSubgraphUrl, distribution?.timestamp]);

    return {
        loading,
        hash,
    };
}

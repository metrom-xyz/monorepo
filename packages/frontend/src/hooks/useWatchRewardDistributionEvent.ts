import type { SupportedChain } from "@metrom-xyz/contracts";
import { useEffect, useState } from "react";
import type { Hex } from "viem";
import { CHAIN_DATA } from "../commons";
import { query } from "../utils/subgraph";
import { Status, type Campaign } from "@metrom-xyz/sdk";

export interface GetLatestDistributeRewardEventResult {
    distributeRewardEvents: {
        id: Hex;
        transaction: {
            blockNumber: number;
            timestamp: number;
        };
    }[];
}

export interface RewardDistribution {
    id: Hex;
    blockNumber: number;
    timestamp: number;
}

export const GetLatestDistributeRewardEvent = `
    query getLatestDistributeRewardEvent($campaignId: ID!) {
        distributeRewardEvents(first: 1, orderDirection: desc, orderBy: id, where: { campaign: $campaignId }) {
            id
            transaction {
                blockNumber
                timestamp
            }
        }
    }
`;

// TODO: move fetch to a subgraph client in the sdk?
export function useWatchRewardDistributionEvent(campaign?: Campaign): {
    loading: boolean;
    distribution?: RewardDistribution;
} {
    const [lastDistribution, setLastDistribution] =
        useState<RewardDistribution>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);

            if (
                !campaign ||
                (lastDistribution && campaign.status === Status.Ended)
            )
                return;

            try {
                if (!cancelled) setLoading(true);

                const response =
                    await query<GetLatestDistributeRewardEventResult>(
                        CHAIN_DATA[campaign.chainId as SupportedChain]
                            .metromSubgraphUrl,
                        GetLatestDistributeRewardEvent,
                        {
                            campaignId: campaign.id,
                        },
                    );

                const rawDistribution = response.distributeRewardEvents[0];

                const distribution: RewardDistribution = {
                    id: rawDistribution.id,
                    blockNumber: rawDistribution.transaction.blockNumber,
                    timestamp: rawDistribution.transaction.timestamp,
                };

                if (
                    lastDistribution &&
                    lastDistribution.timestamp === distribution.timestamp
                )
                    return;

                if (!cancelled) setLastDistribution(distribution);
            } catch (error) {
                console.error(
                    `Could not fetch distribution events for campaign with id ${campaign.id} and chain with id ${campaign.chainId}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (!lastDistribution) {
            fetchData();
            return;
        }

        const interval = setInterval(() => {
            fetchData();
        }, 15000);

        return () => {
            clearInterval(interval);
        };
    }, [campaign, lastDistribution]);

    return {
        loading,
        distribution: lastDistribution,
    };
}

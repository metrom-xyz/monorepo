import type { Address } from "blo";
import {
    type Campaign,
    type OnChainAmount,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export interface Rank {
    account: Address;
    weight: number;
    position: number;
    usdValue: number | null;
    distributed: OnChainAmount | UsdPricedErc20TokenAmount[];
}

export interface Leaderboard {
    timestamp: number;
    connectedAccountRank?: Rank;
    sortedRanks: Rank[];
}

export function useLeaderboard(campaign?: Campaign): {
    loading: boolean;
    leaderboard?: Leaderboard;
} {
    const { address } = useAccount();

    const { data, isPending } = useQuery({
        queryKey: ["leaderboard", campaign, address],
        queryFn: async ({ queryKey }) => {
            const campaign = queryKey[1] as Campaign;
            if (!campaign) return undefined;

            const account = queryKey[2] as Address | undefined;

            try {
                const rawLeaderboard = await metromApiClient.fetchLeaderboard({
                    campaign,
                    account,
                });

                if (!rawLeaderboard) return undefined;

                const sortedRanks = rawLeaderboard.ranks.map((rank) => {
                    return <Rank>{
                        ...rank,
                        usdValue:
                            rank.distributed instanceof Array
                                ? rank.distributed.reduce(
                                      (acc, distributed) => {
                                          return (
                                              acc + distributed.amount.usdValue
                                          );
                                      },
                                      0,
                                  )
                                : null,
                        distributed: rank.distributed,
                    };
                });
                sortedRanks.sort((a, b) => b.weight - a.weight);

                const connectedAccountRankIndex = sortedRanks.findIndex(
                    (rank) => rank.account === account?.toLowerCase(),
                );

                const connectedAccountRank =
                    connectedAccountRankIndex !== -1
                        ? sortedRanks.splice(connectedAccountRankIndex, 1)[0]
                        : undefined;

                return <Leaderboard>{
                    timestamp: rawLeaderboard.updatedAt,
                    connectedAccountRank,
                    sortedRanks,
                };
            } catch (error) {
                throw new Error(
                    `Could not fetch leaderboard for campaign with id ${campaign.id} in chain with id ${campaign.chainId}: ${error}`,
                );
            }
        },
        enabled: !!campaign,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isPending,
        leaderboard: data,
    };
}

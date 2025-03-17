import type { Address } from "blo";
import {
    type Campaign,
    type OnChainAmount,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import type { HookBaseParams } from "../types/hooks";

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

interface UseLeaderboardParams extends HookBaseParams {
    campaign?: Campaign;
}

type QueryKey = [string, Campaign | undefined, Address | undefined];

export function useLeaderboard({
    campaign,
    enabled = true,
}: UseLeaderboardParams = {}): {
    loading: boolean;
    leaderboard?: Leaderboard;
} {
    const { address } = useAccount();

    const { data, isPending } = useQuery({
        queryKey: ["leaderboard", campaign, address],
        queryFn: async ({ queryKey }) => {
            const [, campaign, account] = queryKey as QueryKey;
            if (!campaign) return null;

            try {
                const response = await METROM_API_CLIENT.fetchLeaderboard({
                    campaign,
                    account,
                });

                if (!response) return null;

                const { updatedAt, leaderboard } = response;

                const sortedRanks = leaderboard.ranks.map((rank) => {
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
                    timestamp: updatedAt,
                    connectedAccountRank,
                    sortedRanks,
                };
            } catch (error) {
                console.error(
                    `Could not fetch leaderboard for campaign with id ${campaign.id} in chain with id ${campaign.chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!campaign,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isPending,
        leaderboard: data || undefined,
    };
}

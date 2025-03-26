import type { Address, Hex } from "viem";
import {
    type OnChainAmount,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import type { QueryOptions, QueryResult } from "../types";

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

export interface UseLeaderboardParams
    extends QueryOptions<Leaderboard | undefined> {
    address?: Address;
    campaignId?: Hex;
    chainId?: number;
}

export type UseLeaderboardReturnValue = QueryResult<Leaderboard | undefined>;

type QueryKey = [string, Hex, number, Address | undefined];

/** https://docs.metrom.xyz/react-library/use-leaderboard */
export function useLeaderboard({
    options,
    campaignId,
    chainId,
    address,
}: UseLeaderboardParams): UseLeaderboardReturnValue {
    const metromClient = useMetromClient();

    const { data, isLoading, isPending, isFetching } = useQuery({
        ...options,
        queryKey: ["leaderboard", campaignId, chainId, address],
        queryFn: async ({ queryKey }) => {
            const [, campaignId, chainId, account] = queryKey as QueryKey;

            try {
                const response = await metromClient.fetchLeaderboard({
                    campaignId,
                    chainId,
                    account,
                });

                if (!response) return undefined;

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
                        ? sortedRanks.length < 5
                            ? sortedRanks[connectedAccountRankIndex]
                            : sortedRanks.splice(
                                  connectedAccountRankIndex,
                                  1,
                              )[0]
                        : undefined;

                return <Leaderboard>{
                    timestamp: updatedAt,
                    connectedAccountRank,
                    sortedRanks,
                };
            } catch (error) {
                console.error(
                    `Could not fetch leaderboard for campaign with id ${campaignId} in chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: !!campaignId && !!chainId,
        refetchOnWindowFocus: false,
    });

    return { data, isLoading, isPending, isFetching };
}

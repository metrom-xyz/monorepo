import type { Address, Hex } from "viem";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Leaderboard, Rank } from "../types/campaign";
import { ChainType } from "@metrom-xyz/sdk";
import { useAccount } from "./useAccount";

interface UseLeaderboardParams extends HookBaseParams {
    campaignId?: Hex;
    chainId?: SupportedChain;
    chainType?: ChainType;
}

type QueryKey = [
    string,
    Hex | undefined,
    SupportedChain | undefined,
    ChainType | undefined,
    Address | undefined,
];

export function useLeaderboard({
    campaignId,
    chainId,
    chainType,
    enabled = true,
}: UseLeaderboardParams = {}): {
    loading: boolean;
    leaderboard?: Leaderboard;
} {
    const { address } = useAccount();

    const { data, isPending } = useQuery({
        queryKey: ["leaderboard", campaignId, chainId, chainType, address],
        queryFn: async ({ queryKey }) => {
            const [, campaignId, chainId, chainType, account] =
                queryKey as QueryKey;
            if (!campaignId || !chainType || !chainId) return null;

            try {
                const response = await METROM_API_CLIENT.fetchLeaderboard({
                    campaignId,
                    chainId,
                    chainType,
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
                        ? sortedRanks.length <= 5
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
        enabled: enabled && !!campaignId && !!chainId,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isPending,
        leaderboard: data || undefined,
    };
}

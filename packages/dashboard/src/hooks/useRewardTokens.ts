import { METROM_API_CLIENT } from "../commons";
import type { RewardToken } from "@metrom-xyz/sdk";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useActiveChains } from "./useActiveChains";

interface UseRewardTokensReturnValue {
    loading: boolean;
    tokens: RewardTokenWithChain[];
}

export interface RewardTokenWithChain extends RewardToken {
    chainId: number;
}

export function useRewardTokens(): UseRewardTokensReturnValue {
    const chains = useActiveChains();

    const { rawRewardTokensResults, loading } = useQueries({
        queries: chains.map((chain) => ({
            queryKey: ["reward-tokens", chain.id],
            queryFn: async () => {
                try {
                    const rewardTokens =
                        await METROM_API_CLIENT.fetchRewardTokens({
                            chainId: chain.id,
                        });

                    return rewardTokens.map((rewardToken) => ({
                        ...rewardToken,
                        chainId: chain.id,
                    })) as RewardTokenWithChain[];
                } catch (error) {
                    console.error(
                        `Could not fetch reward tokens for chain ${chain}: ${error}`,
                    );
                    throw error;
                }
            },
            refetchOnWindowFocus: false,
            staleTime: 60000,
        })),
        combine: (results) => {
            return {
                rawRewardTokensResults: results.map((result) => result.data),
                loading: results.some((result) => result.isPending),
            };
        },
    });

    const tokens = useMemo(() => {
        const rewards: RewardTokenWithChain[] = [];

        for (const rawRewardTokensResult of rawRewardTokensResults) {
            if (!rawRewardTokensResult) continue;

            for (const rawRewardToken of rawRewardTokensResult) {
                rewards.push(rawRewardToken);
            }
        }

        return rewards;
    }, [rawRewardTokensResults]);

    return {
        loading,
        tokens,
    };
}

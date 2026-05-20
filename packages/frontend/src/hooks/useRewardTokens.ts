import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import type { ChainType, RewardToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { useChainType } from "./useChainType";

interface UseRewardTokensParams extends HookBaseParams {
    chainId?: number;
}

type QueryKey = [string, SupportedChain | undefined, ChainType];

const collator = new Intl.Collator();

export function useRewardTokens({
    chainId,
    enabled = true,
}: UseRewardTokensParams = {}): {
    loading: boolean;
    tokens: RewardToken[] | undefined;
} {
    const chainType = useChainType();

    const { data: tokens, isPending: loading } = useQuery({
        queryKey: ["reward-tokens", chainId, chainType],
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType] = queryKey as QueryKey;
            if (!chainId) return null;

            try {
                const rewardTokens = await METROM_API_CLIENT.fetchRewardTokens({
                    chainId,
                    chainType,
                });

                return rewardTokens.sort((a, b) =>
                    collator.compare(
                        a.symbol.toLowerCase(),
                        b.symbol.toLowerCase(),
                    ),
                );
            } catch (error) {
                console.error(`Could not fetch reward tokens: ${error}`);
                throw error;
            }
        },
        enabled: enabled && !!chainId,
    });

    return {
        loading,
        tokens: tokens || undefined,
    };
}

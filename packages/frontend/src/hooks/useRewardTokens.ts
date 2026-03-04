import type { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_TYPE, METROM_API_CLIENT } from "../commons";
import type { RewardToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";

interface UseRewardTokensParams extends HookBaseParams {
    chainId?: number;
}

type QueryKey = [string, SupportedChain | undefined];

const collator = new Intl.Collator();

export function useRewardTokens({
    chainId,
    enabled = true,
}: UseRewardTokensParams = {}): {
    loading: boolean;
    tokens: RewardToken[] | undefined;
} {
    const { data: tokens, isPending: loading } = useQuery({
        queryKey: ["reward-tokens", chainId],
        queryFn: async ({ queryKey }) => {
            const [, chainId] = queryKey as QueryKey;
            if (!chainId) return null;

            try {
                const rewardTokens = await METROM_API_CLIENT.fetchRewardTokens({
                    chainId,
                    chainType: CHAIN_TYPE,
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

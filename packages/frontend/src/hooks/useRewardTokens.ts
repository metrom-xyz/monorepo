import type { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_TYPE, METROM_API_CLIENT } from "../commons";
import type { RewardToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { useChainWithType } from "./useChainWithType";

interface UseRewardTokensParams extends HookBaseParams {}

type QueryKey = [string, SupportedChain];

export function useRewardTokens({
    enabled = true,
}: UseRewardTokensParams = {}): {
    loading: boolean;
    tokens: RewardToken[] | undefined;
} {
    const { id: chainId } = useChainWithType();

    const { data: tokens, isPending: loading } = useQuery({
        queryKey: ["reward-tokens", chainId],
        queryFn: async ({ queryKey }) => {
            const [, chainId] = queryKey as QueryKey;
            try {
                return await METROM_API_CLIENT.fetchRewardTokens({
                    chainId,
                    chainType: CHAIN_TYPE,
                });
            } catch (error) {
                console.error(`Could not fetch reward tokens: ${error}`);
                throw error;
            }
        },
        enabled,
    });

    return {
        loading,
        tokens,
    };
}

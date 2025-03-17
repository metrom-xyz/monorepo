import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { METROM_API_CLIENT } from "../commons";
import type { RewardToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";

export function useRewardTokens(): {
    loading: boolean;
    tokens: RewardToken[] | undefined;
} {
    const chainId: SupportedChain = useChainId();

    const { data: tokens, isPending: loading } = useQuery({
        queryKey: ["reward-tokens", chainId],
        queryFn: async ({ queryKey }) => {
            const chainId = queryKey[1] as SupportedChain;
            try {
                return await METROM_API_CLIENT.fetchRewardTokens({ chainId });
            } catch (error) {
                console.error(`Could not fetch reward tokens: ${error}`);
                throw error;
            }
        },
    });

    return {
        loading,
        tokens,
    };
}

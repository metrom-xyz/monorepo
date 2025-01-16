import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { metromApiClient } from "../commons";
import type { FeeToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";

export function useFeeTokens(): {
    loading: boolean;
    tokens: FeeToken[] | undefined;
} {
    const chainId: SupportedChain = useChainId();

    const { data: tokens, isPending: loading } = useQuery({
        queryKey: ["fee-tokens", chainId],
        queryFn: async ({ queryKey }) => {
            const chainId = queryKey[1] as SupportedChain;
            try {
                return await metromApiClient.fetchFeeTokens({ chainId });
            } catch (error) {
                throw new Error(`Could not fetch fee tokens: ${error}`);
            }
        },
    });

    return {
        loading,
        tokens,
    };
}

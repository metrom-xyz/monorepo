import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { METROM_API_CLIENT } from "../commons";
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
                return await METROM_API_CLIENT.fetchFeeTokens({ chainId });
            } catch (error) {
                console.error(`Could not fetch fee tokens: ${error}`);
                throw error;
            }
        },
    });

    return {
        loading,
        tokens,
    };
}

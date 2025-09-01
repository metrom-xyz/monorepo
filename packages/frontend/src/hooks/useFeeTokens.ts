import type { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_TYPE, METROM_API_CLIENT } from "../commons";
import type { FeeToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { useChainId } from "./useChainId";

interface UseFeeTokensParams extends HookBaseParams {}

type QueryKey = [string, SupportedChain];

export function useFeeTokens({ enabled = true }: UseFeeTokensParams = {}): {
    loading: boolean;
    tokens: FeeToken[] | undefined;
} {
    const chainId: SupportedChain = useChainId();

    const { data: tokens, isPending: loading } = useQuery({
        queryKey: ["fee-tokens", chainId],
        queryFn: async ({ queryKey }) => {
            const [, chainId] = queryKey as QueryKey;
            try {
                return await METROM_API_CLIENT.fetchFeeTokens({
                    chainId,
                    chainType: CHAIN_TYPE,
                });
            } catch (error) {
                console.error(`Could not fetch fee tokens: ${error}`);
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

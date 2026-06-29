import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import type { ChainType, FeeToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { useChainWithType } from "./useChainWithType";

type UseFeeTokensParams = HookBaseParams;

type QueryKey = [string, SupportedChain, ChainType];

export function useFeeTokens({ enabled = true }: UseFeeTokensParams = {}): {
    loading: boolean;
    tokens: FeeToken[] | undefined;
} {
    const { id: chainId, type: chainType } = useChainWithType();

    const { data: tokens, isPending: loading } = useQuery({
        queryKey: ["fee-tokens", chainId, chainType],
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType] = queryKey as QueryKey;
            try {
                return await METROM_API_CLIENT.fetchFeeTokens({
                    chainId,
                    chainType,
                });
            } catch (error) {
                console.error(`Could not fetch fee tokens: ${error}`);
                throw error;
            }
        },
        enabled,
        retry: false,
    });

    return {
        loading,
        tokens,
    };
}

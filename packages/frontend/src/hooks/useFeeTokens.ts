import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { CHAIN_TYPE, METROM_API_CLIENT } from "../commons";
import type { FeeToken } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { APTOS } from "../commons/env";

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
                // FIXME: remove
                if (APTOS)
                    return [
                        {
                            address:
                                "0x000000000000000000000000000000000000000000000000000000000000000a",
                            decimals: 8,
                            symbol: "APT",
                            minimumRate: { formatted: 1, raw: 100000000n },
                            name: "Aptos Coin",
                            usdPrice: 5.1898,
                        },
                    ] as FeeToken[];
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

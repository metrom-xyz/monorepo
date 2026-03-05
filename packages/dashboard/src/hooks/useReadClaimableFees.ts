import { useQueries } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { useMemo } from "react";
import { useConfig } from "wagmi";
import { getChainData } from "@/utils/chain";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { APTOS } from "@/commons/env";
import { useClients } from "@aptos-labs/react";
import { RewardTokenWithChain } from "./useRewardTokens";

export interface UseReadClaimableFeesParams {
    tokens: RewardTokenWithChain[];
    enabled?: boolean;
}

export function useReadClaimableFees({
    tokens,
    enabled,
}: UseReadClaimableFeesParams) {
    const config = useConfig();
    const { aptos } = useClients();

    const params = useMemo(() => {
        return tokens
            .map((token: RewardTokenWithChain) => {
                const chainId = token.chainId;
                const chainData = getChainData(chainId);

                if (!chainData) return undefined;

                return {
                    address: chainData.metromContract.address,
                    abi: metromAbi,
                    functionName: "claimableFees",
                    args: [token.address],
                    chainId,
                };
            })
            .filter((params) => !!params);
    }, [tokens]);

    const { results, loading } = useQueries({
        queries: params.map((params) => ({
            queryKey: ["claimable-fees", params.address, params.args],
            queryFn: async () => {
                try {
                    if (APTOS) {
                        return aptos.view({
                            payload: {
                                function: `${params.address}::metrom::claimable_fees`,
                                functionArguments: params.args,
                            },
                        });
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return await readContract(config, params as any);
                    }
                } catch (error) {
                    console.error(
                        `Could not call function ${params.functionName} contract address ${params.address}: ${error}`,
                    );
                    throw error;
                }
            },
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled,
        })),
        combine: (results) => {
            return {
                results: results.map((result) => result.data),
                loading: results.some((result) => result.isPending),
            };
        },
    });

    return { results, loading };
}

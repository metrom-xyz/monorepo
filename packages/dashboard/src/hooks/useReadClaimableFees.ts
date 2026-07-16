import { useQueries } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { useMemo } from "react";
import { useConfig } from "wagmi";
import { getCrossVmChainData } from "@/utils/chain";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "../context/chain-type";
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
    const { chainType } = useChainType();
    const { aptos } = useClients();

    const params = useMemo(() => {
        return tokens
            .map((token: RewardTokenWithChain) => {
                const chainId = token.chainId;
                const chainData = getCrossVmChainData(chainId, chainType);

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
    }, [tokens, chainType]);

    const { results, loading } = useQueries({
        queries: params.map((params) => ({
            // The chain type is needed in the key: Aptos mainnet and Ethereum
            // mainnet share chain id 1, so contract params alone could collide.
            queryKey: [
                "claimable-fees",
                chainType,
                params.address,
                params.args,
            ],
            queryFn: async () => {
                try {
                    if (chainType === ChainType.Aptos) {
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

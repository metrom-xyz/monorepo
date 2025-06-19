import { useQueries } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { useMemo } from "react";
import { useConfig } from "wagmi";
import { RewardTokenWithChain } from "./useRewardTokens";
import { getChainData } from "@/utils/chain";
import { metromAbi } from "@metrom-xyz/contracts/abi";

interface UseReadClaimableFeesParams {
    tokens: RewardTokenWithChain[];
}

export function useReadClaimableFees({ tokens }: UseReadClaimableFeesParams) {
    const config = useConfig();

    const claimableFeesContracts = useMemo(() => {
        return tokens
            .map((token) => {
                const chainId = token.chainId;
                const chainData = getChainData(chainId);

                if (!chainData) return;

                return {
                    address: chainData.metromContract.address,
                    abi: metromAbi,
                    functionName: "claimableFees",
                    args: [token.address],
                    chainId,
                };
            })
            .filter((contract) => !!contract);
    }, [tokens]);

    const { results, loading } = useQueries({
        queries: claimableFeesContracts.map((contract) => ({
            queryKey: [
                "reward-tokens",
                contract.address,
                contract.functionName,
                contract.args,
            ],
            queryFn: async () => {
                try {
                    // FIXME: fix type
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return await readContract(config, contract as any);
                } catch (error) {
                    console.error(
                        `Could not call function ${contract.functionName} contract address ${contract.address}: ${error}`,
                    );
                    throw error;
                }
            },
            refetchOnWindowFocus: false,
            staleTime: 60000,
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

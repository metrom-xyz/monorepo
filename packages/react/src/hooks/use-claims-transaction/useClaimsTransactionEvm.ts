import { Address, Hex } from "viem";
import { useSimulateContract } from "wagmi";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import {
    SimulateContractErrorType,
    SimulateContractReturnType,
} from "wagmi/actions";
import { ClaimWithRemaining, QueryResult } from "../../types";

export interface UseClaimsTransactionEvmParams {
    chainId: number;
    claims: ClaimWithRemaining[];
    address?: Address;
    enabled?: boolean;
}

export type ClaimRewardsSimulationResult = SimulateContractReturnType<
    typeof metromAbi,
    "claimRewards",
    [
        {
            campaignId: Hex;
            proof: Hex[];
            token: Address;
            amount: bigint;
            receiver: Address;
        }[],
    ]
>;

export type UseClaimsTransactionEvmReturnValue = QueryResult<
    ClaimRewardsSimulationResult | undefined
> & {
    error: SimulateContractErrorType | null;
};

export function useClaimsTransactionEvm({
    chainId,
    claims,
    address,
    enabled = true,
}: UseClaimsTransactionEvmParams): UseClaimsTransactionEvmReturnValue {
    const claimsInChain = useMemo(() => {
        return claims.filter((claim) => claim.chainId === chainId);
    }, [chainId, claims]);

    const {
        data: simulatedClaimRewards,
        error: simulateError,
        isLoading,
        isFetching,
        isPending,
    } = useSimulateContract({
        chainId: chainId,
        abi: metromAbi,
        address: ADDRESS[chainId as SupportedChain].address,
        functionName: "claimRewards",
        args: [
            address
                ? claimsInChain.map((claim) => {
                      return {
                          campaignId: claim.campaignId,
                          proof: claim.proof,
                          token: claim.token.address,
                          amount: claim.amount.raw,
                          receiver: address,
                      };
                  })
                : [],
        ],
        query: {
            enabled: enabled && !!address && claimsInChain.length > 0,
        },
    });

    return {
        data: simulatedClaimRewards,
        error: simulateError,
        isLoading,
        isFetching,
        isPending,
    };
}

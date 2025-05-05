import { Address, Hex } from "viem";
import { useSimulateContract } from "wagmi";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import {
    SimulateContractErrorType,
    SimulateContractReturnType,
} from "wagmi/actions";
import { QueryResult } from "../types";
import { ClaimWithRemaining } from "./useClaims";

export interface UseClaimsTransactionParams {
    chainId: number;
    claims: ClaimWithRemaining[];
    address?: Address;
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

export type UseClaimsTransactionReturnValue = QueryResult<
    ClaimRewardsSimulationResult | undefined
> & {
    error: SimulateContractErrorType | null;
};

/** https://docs.metrom.xyz/react-library/use-claims-transaction */
export function useClaimsTransaction({
    chainId,
    claims,
    address,
}: UseClaimsTransactionParams): UseClaimsTransactionReturnValue {
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
            enabled: address && claimsInChain.length > 0,
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

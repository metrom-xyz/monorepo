import { Address, Hex } from "viem";
import { BaseHookParams } from "../types";
import { useClaims } from "./useClaims";
import { useSimulateContract } from "wagmi";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import {
    SimulateContractErrorType,
    SimulateContractReturnType,
} from "wagmi/actions";
import { Claim } from "@metrom-xyz/sdk";

interface UseClaimsTransactionParams extends BaseHookParams {
    chainId: SupportedChain;
    address?: Address;
}

export function useClaimsTransaction({
    apiClient,
    address,
    chainId,
}: UseClaimsTransactionParams): {
    loading: boolean;
    error: SimulateContractErrorType | null;
    claims: Claim[];
    data?: SimulateContractReturnType<
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
} {
    const { claims, loading: loadingClaims } = useClaims({
        apiClient,
        address,
    });

    const claimsInChain = useMemo(() => {
        return claims.filter((claim) => claim.chainId === chainId);
    }, [chainId, claims]);

    const {
        data: simulatedClaim,
        isLoading: simulatingClaim,
        error: simulateError,
    } = useSimulateContract({
        chainId: chainId,
        abi: metromAbi,
        address: ADDRESS[chainId].address,
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
        loading: loadingClaims || simulatingClaim,
        error: simulateError,
        claims,
        data: simulatedClaim,
    };
}

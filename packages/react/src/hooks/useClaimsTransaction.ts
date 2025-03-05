import { Address, Hex } from "viem";
import { useSimulateContract } from "wagmi";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import {
    SimulateContractErrorType,
    SimulateContractReturnType,
} from "wagmi/actions";
import { Claim } from "@metrom-xyz/sdk";

export interface UseClaimsTransactionParams {
    chainId: SupportedChain;
    claims: Claim[];
    address?: Address;
}

export interface UseClaimsTransactionReturnValue {
    loading: boolean;
    error: SimulateContractErrorType | null;
    transaction?: SimulateContractReturnType<
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
}

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
        isLoading: simulatingClaimRewards,
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
        loading: simulatingClaimRewards,
        error: simulateError,
        transaction: simulatedClaimRewards,
    };
}

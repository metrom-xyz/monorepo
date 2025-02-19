import { Address, Hex } from "viem";
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

interface UseClaimsTransactionParams {
    chainId: SupportedChain;
    address?: Address;
}

interface UseClaimsTransactionReturnValue {
    loading: boolean;
    error: SimulateContractErrorType | null;
    claims: Claim[];
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

/**
 * Fetches the available claims for an account and simulates/validates the contract interaction
 * in order to perform the rewards claim.
 *
 * @param {Object} param - The parameters object.
 * @param {string} param.address - The wallet address of the receiver account.
 * @param {SupportedChain} param.chainId - The chain id.
 *
 * @returns {UseClaimsTransactionReturnValue} Object including the simulation result, that can be used to submit the transaction,
 * using the useWriteContract hook from wagmi.
 */
export function useClaimsTransaction({
    address,
    chainId,
}: UseClaimsTransactionParams): UseClaimsTransactionReturnValue {
    const { claims, loading: loadingClaims } = useClaims({
        address,
    });

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
        loading: loadingClaims || simulatingClaimRewards,
        error: simulateError,
        claims: claimsInChain,
        transaction: simulatedClaimRewards,
    };
}

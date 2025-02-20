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

interface UseClaimsTransactionParams {
    chainId: SupportedChain;
    claims: Claim[];
    address?: Address;
}

interface UseClaimsTransactionReturnValue {
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

/**
 * Simulates and validates contract interactions to claim the specified rewards for an account on a given chain id.
 *
 * @param {Object} param - The parameters object.
 * @param {SupportedChain} param.chainId - The chain id.
 * @param {SupportedChain} param.claims - The claims fetched using the useClaims hook.
 * @param {string} param.address - The wallet address of the receiver account.
 *
 * @returns {UseClaimsTransactionReturnValue} Object including the simulation result, that can be used to submit the transaction,
 * using the useWriteContract hook from wagmi.
 */
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

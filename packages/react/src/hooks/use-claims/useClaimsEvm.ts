import { useReadContracts } from "wagmi";
import { formatUnits, type Address, type Hex } from "viem";
import { ChainType } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "../useMetromClient";
import {
    ClaimWithRemaining,
    QueryOptions,
    type QueryResult,
} from "../../types";

export interface UseClaimsEvmParams extends QueryOptions<
    ClaimWithRemaining[] | undefined
> {
    address?: Address;
}

export type UseClaimsEvmReturnValue = QueryResult<
    ClaimWithRemaining[] | undefined
>;

type QueryKey = [string, ChainType, Hex | undefined];

export function useClaimsEvm(
    params: UseClaimsEvmParams,
): UseClaimsEvmReturnValue {
    const metromClient = useMetromClient();

    const {
        data: rawClaims,
        isLoading: isLoadingClaims,
        isPending: isPendingClaims,
        isFetching: isFetchingClaims,
    } = useQuery({
        ...params.options,
        queryKey: ["claims", ChainType.Evm, params.address],
        queryFn: async ({ queryKey }) => {
            const [, , account] = queryKey as QueryKey;

            try {
                const claims = await metromClient.fetchClaims({
                    address: account as Address,
                    chainType: ChainType.Evm,
                });

                return claims.map((claim) => ({
                    ...claim,
                    remaining: null,
                }));
            } catch (error) {
                console.error(
                    `Could not fetch raw claims for address ${params.address}: ${error}`,
                );
                throw error;
            }
        },
        enabled: (params.options?.enabled ?? true) && !!params.address,
    });

    const {
        data: claimedData,
        isLoading: isLoadingClaimed,
        isPending: isPendingClaimed,
        isFetching: isFetchingClaimed,
    } = useReadContracts({
        allowFailure: false,
        contracts:
            rawClaims &&
            rawClaims.map((rawClaim) => {
                return {
                    chainId: rawClaim.chainId,
                    address:
                        ADDRESS[rawClaim.chainId as SupportedChain].address,
                    abi: metromAbi,
                    functionName: "claimedCampaignReward",
                    args: [
                        rawClaim.campaignId,
                        rawClaim.token.address,
                        params.address,
                    ],
                };
            }),
        query: { enabled: (params.options?.enabled ?? true) && !!rawClaims },
    });

    const claims = useMemo(() => {
        if (!rawClaims || !claimedData) return undefined;

        const claims: ClaimWithRemaining[] = [];
        for (let i = 0; i < claimedData.length; i++) {
            const rawClaimed = claimedData[i] as unknown as bigint;
            const rawClaim = rawClaims[i];

            const rawRemaining = rawClaim.amount.raw - rawClaimed;
            const formattedRemaining = Number(
                formatUnits(rawRemaining, rawClaim.token.decimals),
            );

            if (formattedRemaining > 0) {
                claims.push({
                    ...rawClaim,
                    remaining: {
                        raw: rawRemaining,
                        formatted: formattedRemaining,
                    },
                });
            }
        }

        return claims;
    }, [claimedData, rawClaims]);

    return {
        data: claims,
        isFetching: isFetchingClaims || isFetchingClaimed,
        isLoading: isLoadingClaims || isLoadingClaimed,
        isPending: isPendingClaims || isPendingClaimed,
    };
}

import { useReadContracts } from "wagmi";
import { formatUnits, type Address, type Hex } from "viem";
import { type Claim, type OnChainAmount } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import { QueryOptions, type QueryResult } from "../types";

export interface ClaimWithRemaining extends Claim {
    remaining: OnChainAmount | null;
}

export interface UseClaimsParams
    extends QueryOptions<ClaimWithRemaining[] | undefined> {
    address?: Address;
}

export type UseClaimsReturnValue = QueryResult<
    ClaimWithRemaining[] | undefined
>;

type QueryKey = [string, Hex];

/** https://docs.metrom.xyz/react-library/use-claims */
export function useClaims(params: UseClaimsParams): UseClaimsReturnValue {
    const [claims, setClaims] = useState<ClaimWithRemaining[] | undefined>();
    const metromClient = useMetromClient();

    const {
        data: rawClaims,
        isLoading: isLoadingClaims,
        isPending: isPendingClaims,
        isFetching: isFetchingClaims,
    } = useQuery({
        ...params.options,
        queryKey: ["claims", params.address],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as QueryKey;

            try {
                const claims = await metromClient.fetchClaims({
                    address: account as Address,
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
        enabled: !!params.address,
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
        query: {
            enabled: !!rawClaims,
        },
    });

    useEffect(() => {
        if (!rawClaims || !claimedData) {
            setClaims([]);
            return;
        }

        const claims = [];
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
                    remaining: <OnChainAmount>{
                        raw: rawRemaining,
                        formatted: formattedRemaining,
                    },
                });
            }
        }

        setClaims(claims);
    }, [claimedData, rawClaims]);

    return {
        data: claims,
        isFetching: isFetchingClaims || isFetchingClaimed,
        isLoading: isLoadingClaims || isLoadingClaimed,
        isPending: isPendingClaims || isPendingClaimed,
    };
}

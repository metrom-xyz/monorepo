import { useAccount, useBlockNumber, useReadContracts } from "wagmi";
import { formatUnits, type Address } from "viem";
import { CHAIN_DATA, metromApiClient } from "../commons";
import { type Claim } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ClaimWithRemaining extends Claim {
    remaining: number;
}

export function useClaims(): {
    loading: boolean;
    claims: Claim[];
} {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>([]);

    const queryClient = useQueryClient();
    const { address } = useAccount();
    const { data: blockNumber } = useBlockNumber({ watch: true });

    const { data: rawClaims, isPending: loadingClaims } = useQuery({
        queryKey: ["claims", address],
        queryFn: async ({ queryKey }) => {
            const account = queryKey[1];
            if (!account) return undefined;

            try {
                const rawClaims = await metromApiClient.fetchClaims({
                    address: account as Address,
                });
                return rawClaims;
            } catch (error) {
                throw new Error(
                    `Could not fetch raw claims for address ${address}: ${error}`,
                );
            }
        },
        refetchOnMount: false,
        enabled: !!address,
    });

    const {
        isLoading: loadingClaimed,
        data: claimedData,
        isError: claimedErrored,
        error: claimedError,
        queryKey,
    } = useReadContracts({
        allowFailure: false,
        contracts:
            rawClaims &&
            rawClaims.map((rawClaim) => {
                return {
                    chainId: rawClaim.chainId,
                    address:
                        CHAIN_DATA[rawClaim.chainId]?.metromContract.address,
                    abi: metromAbi,
                    functionName: "claimedCampaignReward",
                    args: [
                        rawClaim.campaignId,
                        rawClaim.token.address,
                        address,
                    ],
                };
            }),
        query: {
            enabled: !!rawClaims,
        },
    });

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey });
    }, [blockNumber, queryClient, queryKey]);

    useEffect(() => {
        if (loadingClaims || loadingClaimed) return;
        if (claimedErrored) {
            console.error(
                `Could not fetch claimed data for address ${address}: ${claimedError}`,
            );
            return;
        }
        if (!rawClaims || !claimedData) {
            setClaims([]);
            return;
        }

        const claims = [];
        const alreadyClaimed = [];
        for (let i = 0; i < claimedData.length; i++) {
            const rawClaimed = claimedData[i] as unknown as bigint;
            const rawClaim = rawClaims[i];
            const claimed = Number(
                formatUnits(rawClaimed, rawClaim.token.decimals),
            );
            const remaining = rawClaim.amount - claimed;
            if (remaining > 0) {
                claims.push({
                    ...rawClaim,
                    remaining,
                });
            } else {
                alreadyClaimed.push({ ...rawClaim, remaining });
            }
        }

        setClaims(claims);
    }, [
        address,
        claimedData,
        claimedError,
        claimedErrored,
        loadingClaimed,
        loadingClaims,
        rawClaims,
    ]);

    return {
        loading: loadingClaims || loadingClaimed,
        claims,
    };
}

import { useAccount, useReadContracts } from "wagmi";
import { formatUnits, type Address } from "viem";
import { CHAIN_DATA, METROM_API_CLIENT } from "../commons";
import { type Claim, type OnChainAmount } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";

interface ClaimWithRemaining extends Claim {
    remaining: OnChainAmount;
}

interface UseClaimsParams extends HookBaseParams {}

type QueryKey = [string, Address | undefined];

export function useClaims({ enabled = true }: UseClaimsParams = {}): {
    loadingClaims: boolean;
    loadingClaimed: boolean;
    claims: Claim[];
} {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>([]);

    const { address } = useAccount();

    const {
        data: rawClaims,
        isError: claimsErrored,
        isLoading: loadingClaims,
    } = useQuery({
        queryKey: ["claims", address],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as QueryKey;
            if (!account) return null;

            try {
                const rawClaims = await METROM_API_CLIENT.fetchClaims({
                    address: account,
                });
                return rawClaims;
            } catch (error) {
                console.error(
                    `Could not fetch raw claims for address ${address}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!address,
    });

    const {
        data: claimedData,
        error: claimedError,
        isError: claimedErrored,
        isLoading: loadingClaimed,
    } = useReadContracts({
        allowFailure: false,
        contracts: rawClaims
            ? rawClaims.map((rawClaim) => {
                  return {
                      chainId: rawClaim.chainId,
                      address:
                          CHAIN_DATA[rawClaim.chainId as SupportedChain]
                              ?.metromContract.address,
                      abi: metromAbi,
                      functionName: "claimedCampaignReward",
                      args: [
                          rawClaim.campaignId,
                          rawClaim.token.address,
                          address,
                      ],
                  };
              })
            : undefined,
        query: {
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!rawClaims,
        },
    });

    useEffect(() => {
        if (loadingClaims || loadingClaimed) {
            return;
        }
        if (claimsErrored || claimedErrored) {
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
    }, [
        address,
        claimedData,
        claimedError,
        claimedErrored,
        claimsErrored,
        loadingClaimed,
        loadingClaims,
        rawClaims,
    ]);

    return {
        loadingClaims,
        loadingClaimed,
        claims,
    };
}

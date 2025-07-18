import { useAccount, useChains, useConfig } from "wagmi";
import { formatUnits, type Address } from "viem";
import { METROM_API_CLIENT } from "../commons";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { ClaimWithRemaining } from "../types/campaign";
import { getChainData } from "../utils/chain";
import { readContracts } from "@wagmi/core";

interface UseClaimsParams extends HookBaseParams {}

interface UseClaimsReturnaValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    claims?: ClaimWithRemaining[];
}

type QueryKey = [string, Address | undefined];

export function useClaims({
    enabled = true,
}: UseClaimsParams = {}): UseClaimsReturnaValue {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>();

    const config = useConfig();
    const supportedChains = useChains();
    const queryClient = useQueryClient();
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

                return rawClaims.filter(({ chainId }) =>
                    supportedChains.find(({ id }) => id === chainId),
                );
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

    const claimedContracts = useMemo(() => {
        if (!rawClaims) return undefined;

        return rawClaims
            .map((rawClaim) => {
                const chainData = getChainData(rawClaim.chainId);
                if (!chainData) return null;

                return {
                    chainId: rawClaim.chainId,
                    address: chainData.metromContract.address,
                    abi: metromAbi,
                    functionName: "claimedCampaignReward",
                    args: [
                        rawClaim.campaignId,
                        rawClaim.token.address,
                        address,
                    ],
                };
            })
            .filter((claim) => !!claim);
    }, [address, rawClaims]);

    const {
        data: claimedData,
        error: claimedErrored,
        isLoading: loadingClaimed,
        isError: claimedError,
    } = useQuery({
        queryKey: ["claimed-campaign-rewards", claimedContracts],
        queryFn: async ({ queryKey }) => {
            const [, contracts] = queryKey as [string, typeof claimedContracts];

            if (!contracts) return null;

            try {
                return await readContracts(config, {
                    allowFailure: false,
                    contracts,
                });
            } catch (error) {
                console.error(
                    `Could not call fetch claimed campaign rewards: ${error}`,
                );
                throw error;
            }
        },
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: !!claimedContracts,
    });

    useEffect(() => {
        if (!address) return;
        if (claimsErrored || claimedErrored) {
            console.error(
                `Could not fetch claimed data for address ${address}: ${claimedError}`,
            );
            setClaims([]);
            return;
        }
        if (loadingClaims || loadingClaimed) return;
        if (!rawClaims || !claimedData) {
            setClaims([]);
            return;
        }

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
                        usdValue: formattedRemaining * rawClaim.token.usdPrice,
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

    // Can be used to invalide the contract queries, to update the rewards
    // after a successful claim.
    const invalidate = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: ["claimed-campaign-rewards"],
        });
    }, [queryClient]);

    return {
        loading: loadingClaims || loadingClaimed || !claims,
        invalidate,
        claims,
    };
}

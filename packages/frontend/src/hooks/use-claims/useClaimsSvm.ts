import { useCallback, useEffect, useState } from "react";
import type { UseClaimsParams, UseClaimsReturnValue } from ".";
import type { ClaimWithRemaining } from "@/src/types/campaign/common";
import { useChainWithType } from "../useChainWithType";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSolanaClient, useWalletConnection } from "@solana/react-hooks";
import {
    type Address as AddressSvm,
    getProgramDerivedAddress,
    getAddressEncoder,
    address,
} from "@solana/kit";
import { METROM_API_CLIENT } from "@/src/commons";
import { formatUnits, type Address } from "viem";
import { getChainData } from "@/src/utils/chain";

type QueryKey = [string, string | undefined];

export function useClaimsSvm({
    enabled = true,
}: UseClaimsParams = {}): UseClaimsReturnValue {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>();
    const [claimedRewardPdas, setClaimedRewardPdas] =
        useState<AddressSvm<string>[]>();

    const queryClient = useQueryClient();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { id } = useChainWithType();

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
                    address: account as Address,
                });

                // TODO: filter by active chains? Probably not needed since we're only supporting Solana
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

    useEffect(() => {
        if (!wallet || !rawClaims) return;

        const derive = async () => {
            const pdas = await Promise.all(
                rawClaims
                    .filter((rawClaim) => rawClaim.chainId === id)
                    .map(async (rawClaim) => {
                        const chainData = getChainData(rawClaim.chainId);
                        if (!chainData) return null;

                        const { metromContract: metrom } = chainData;
                        const [claimedRewardPDA] =
                            await getProgramDerivedAddress({
                                programAddress: address(metrom.address),
                                seeds: [
                                    "claimed_reward",
                                    wallet.account.publicKey,
                                    getAddressEncoder().encode(
                                        address(rawClaim.campaignId),
                                    ),
                                ],
                            });

                        return claimedRewardPDA;
                    }),
            );

            setClaimedRewardPdas(
                pdas.filter((pda): pda is AddressSvm<string> => !!pda),
            );
        };

        void derive();
    }, [id, rawClaims, wallet]);

    const {
        data: claimedData,
        error: claimedError,
        isLoading: loadingClaimed,
        isError: claimedErrored,
    } = useQuery({
        queryKey: ["claimed-campaign-rewards", claimedRewardPdas],
        queryFn: async ({ queryKey }) => {
            const [, pdas] = queryKey as [string, typeof claimedRewardPdas];

            if (!pdas) return null;

            try {
                const claimedRewardsAccounts = await client.runtime.rpc
                    .getMultipleAccounts(pdas, { encoding: "base64" })
                    .send();

                return claimedRewardsAccounts.value.map((value) => {
                    if (!value) return;

                    const raw = Buffer.from(value.data[0], "base64");
                    return raw.readBigUInt64LE(8);
                });
            } catch (error) {
                console.error(
                    `Could not fetch claimed campaign rewards: ${error}`,
                );
                throw error;
            }
        },
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!claimedRewardPdas,
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
            // FIXME: is it correct to default to 0n if there's no account info? It means that if the user has no claimed rewards,
            // we assume they have claimed 0, which is correct. But if there's an error fetching the account info,
            // we also assume they have claimed 0, which might not be correct. We should probably differentiate between these two cases.
            const rawClaimed = claimedData[i] || 0n;
            const rawClaim = rawClaims[i];

            const rawRemaining = rawClaim.amount.raw - BigInt(rawClaimed);
            // FIXME: formatUnits from viem not the best?
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

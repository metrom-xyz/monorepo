import { useCallback, useEffect, useState } from "react";
import type { UseClaimsParams, UseClaimsReturnValue } from ".";
import type { ClaimWithRemaining } from "@/src/types/campaign/common";
import { useChainWithType } from "../useChainWithType";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSolanaClient, useWalletConnection } from "@solana/react-hooks";
import { type Address as AddressSvm, getBase64Encoder } from "@solana/kit";
import { METROM_API_CLIENT } from "@/src/commons";
import { formatUnits } from "viem";
import { getChainData } from "@/src/utils/chain";
import {
    findUserClaimedRewardPda,
    getClaimedRewardDecoder,
} from "@metrom-xyz/programs-solana";
import { useAccount } from "../useAccount";

type QueryKey = [string, string | undefined];

export function useClaimsSvm({
    enabled = true,
}: UseClaimsParams = {}): UseClaimsReturnValue {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>();
    const [claimedPdas, setClaimedRewardPdas] =
        useState<AddressSvm<string>[]>();

    const queryClient = useQueryClient();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { address } = useAccount();
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
                    address: account,
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

                        const claimedPda = await findUserClaimedRewardPda({
                            signer: address as AddressSvm,
                            campaign: rawClaim.campaignId as AddressSvm,
                        });

                        return claimedPda[0];
                    }),
            );

            setClaimedRewardPdas(
                pdas.filter((pda): pda is AddressSvm => !!pda),
            );
        };

        void derive();
    }, [id, rawClaims, wallet, address]);

    const {
        data: claimedData,
        error: claimedError,
        isLoading: loadingClaimed,
        isError: claimedErrored,
    } = useQuery({
        queryKey: ["claimed-campaign-rewards", claimedPdas],
        queryFn: async ({ queryKey }) => {
            const [, claimedAccounts] = queryKey as [
                string,
                typeof claimedPdas,
            ];

            if (!claimedAccounts) return null;

            try {
                const claimedRewardsAccounts = await client.runtime.rpc
                    .getMultipleAccounts(claimedAccounts, {
                        encoding: "base64",
                    })
                    .send();

                return claimedRewardsAccounts.value.map((value) => {
                    if (!value) return 0n;

                    return getClaimedRewardDecoder().decode(
                        getBase64Encoder().encode(value.data[0]),
                    ).claimed;
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
        enabled: enabled && !!claimedPdas,
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

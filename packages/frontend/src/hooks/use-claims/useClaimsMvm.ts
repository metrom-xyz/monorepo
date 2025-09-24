import { formatUnits, type Address } from "viem";
import { METROM_API_CLIENT } from "../../commons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ClaimWithRemaining } from "../../types/campaign";
import { getChainData } from "../../utils/chain";
import type { UseClaimsParams, UseClaimsReturnValue } from ".";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
    type InputViewFunctionData,
    type MoveFunctionId,
    AccountAddress,
} from "@aptos-labs/ts-sdk";
import { useClients } from "@aptos-labs/react";
import { useChainWithType } from "../useChainWithType";

type QueryKey = [string, Address | undefined];

export function useClaimsMvm({
    enabled = true,
}: UseClaimsParams = {}): UseClaimsReturnValue {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>();

    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { id } = useChainWithType();
    const { aptos } = useClients();

    const address = account?.address.toStringLong();

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

                // TODO: filter by active chains? Probably not needed since we're only supporting Aptos
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

    const claimedPayloads: InputViewFunctionData[] | undefined = useMemo(() => {
        if (!rawClaims) return undefined;

        return (
            rawClaims
                // Filter claims by the connected Aptos chain
                .filter((rawClaim) => rawClaim.chainId === id)
                .map((rawClaim) => {
                    const chainData = getChainData(rawClaim.chainId);
                    if (!chainData || !address) return null;

                    const { metromContract: metrom } = chainData;
                    const moveFunction: MoveFunctionId = `${metrom.address}::metrom::claimed_campaign_reward`;

                    return {
                        function: moveFunction,
                        functionArguments: [
                            AccountAddress.fromString(
                                rawClaim.campaignId,
                            ).bcsToBytes(),
                            rawClaim.token.address,
                            address,
                        ],
                    };
                })
                .filter((claim) => !!claim)
        );
    }, [address, rawClaims, id]);

    const {
        data: claimedData,
        error: claimedError,
        isLoading: loadingClaimed,
        isError: claimedErrored,
    } = useQuery({
        queryKey: ["claimed-campaign-rewards", claimedPayloads],
        queryFn: async ({ queryKey }) => {
            const [, payloads] = queryKey as [string, typeof claimedPayloads];

            if (!payloads) return null;

            try {
                return await Promise.all(
                    payloads.map((payload) => aptos.view({ payload })),
                );
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
        enabled: enabled && !!claimedPayloads,
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
            const rawClaimed = claimedData[i][0] as unknown as number;
            const rawClaim = rawClaims[i];

            const rawRemaining = rawClaim.amount.raw - BigInt(rawClaimed);
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

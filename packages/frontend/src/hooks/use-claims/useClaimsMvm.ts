import { formatUnits, type Address } from "viem";
import { METROM_API_CLIENT } from "../../commons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ClaimWithRemaining } from "../../types/campaign";
import { getChainData } from "../../utils/chain";
import type { UseClaimsParams, UseClaimsReturnValue } from ".";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/src/components/client-providers";
import type { InputViewFunctionData, MoveFunctionId } from "@aptos-labs/ts-sdk";
import type { Claim } from "@metrom-xyz/sdk";

type QueryKey = [string, Address | undefined];

const rawClaims: Claim[] = [
    {
        chainId: 197,
        campaignId:
            "0xf9b18a4918b3965faf3d4ed06a7215999e5e2c0e6546dec28f92d97b49d51495",
        token: {
            decimals: 18,
            symbol: "tDAI",
            name: "Test DAI",
            usdPrice: 0.999648,
            address:
                "0x681c42269c3ae5b6703f0bdef4a5573998997903f77bab75f40e2c3297e6be9d",
        },
        amount: {
            raw: 1000000000000000000n,
            formatted: 1,
            usdValue: 1,
        },
        proof: [
            "0x0216b99ab038419061fe7f0492e92a901960c8183e6cf87254793c233d77cde4",
            "0xe154a39fb499261bcb3d242a24375029e6a4d833f97a7f224f3e31db419d870c",
            "0x6a3f079eb5d9693807c315f931882d9007ff05e5d92c4492a1dc4a2c0c4d56ec",
            "0x4729280108c9d41de63c59f6c0137d6bf7587a315c74f85b142fad8c6e47dec1",
        ],
    },
];

export function useClaimsMvm({
    enabled = true,
}: UseClaimsParams = {}): UseClaimsReturnValue {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>();

    const queryClient = useQueryClient();
    const { account } = useWallet();

    const address = account?.address.toStringLong();

    const {
        // data: rawClaims,
        isError: claimsErrored,
        isLoading: loadingClaims,
    } = useQuery({
        queryKey: ["claims", address],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as QueryKey;
            if (!account) return null;

            try {
                const rawClaims = await METROM_API_CLIENT.fetchClaims({
                    // address: account,
                    // FIXME: remove, just for testing
                    address: "0xc50275DAC18348425b7815BcdCC6dC82e0838CC5",
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

        return rawClaims
            .map((rawClaim) => {
                const chainData = getChainData(rawClaim.chainId);
                if (!chainData || !address) return null;

                const { metromContract: metrom } = chainData;
                const moveFunction: MoveFunctionId = `${metrom.address}::metrom::claimed_campaign_reward`;

                return {
                    function: moveFunction,
                    functionArguments: [
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
                    payloads.map((payload) => aptosClient.view({ payload })),
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
            const rawClaimed = claimedData[i] as unknown as number;
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

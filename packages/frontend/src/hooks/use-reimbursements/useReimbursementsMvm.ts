import { formatUnits, type Address, zeroAddress, hexToBytes } from "viem";
import { METROM_API_CLIENT } from "../../commons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReimbursementsWithRemaining } from "../../types/campaign";
import { getChainData } from "../../utils/chain";
import type { UseReimbursementsParams, UseReimbursementsReturnValue } from ".";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { InputViewFunctionData, MoveFunctionId } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/src/components/client-providers";
import type { Reimbursement } from "@metrom-xyz/sdk";

interface Payloads {
    recovered: InputViewFunctionData[];
    claimed: InputViewFunctionData[];
}

type QueryKey = [string, Address | undefined];

const rawReimbursements: Reimbursement[] = [
    {
        chainId: 195,
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

export function useReimbursementsMvm({
    enabled = true,
}: UseReimbursementsParams = {}): UseReimbursementsReturnValue {
    const [reimbursements, setReimbursements] =
        useState<ReimbursementsWithRemaining[]>();

    const queryClient = useQueryClient();
    const { account } = useWallet();

    const address = account?.address.toStringLong();

    const {
        // data: rawReimbursements,
        isError: reimbursementsErrored,
        isLoading: loadingReimbursements,
    } = useQuery({
        queryKey: ["reimbursements", address],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as QueryKey;
            if (!account) return null;

            try {
                const rawClaims = await METROM_API_CLIENT.fetchReimbursements({
                    // address: account,
                    // FIXME: remove, just for testing
                    address: "0xc50275DAC18348425b7815BcdCC6dC82e0838CC5",
                });
                return rawClaims;
            } catch (error) {
                console.error(
                    `Could not fetch raw reimbursements for address ${account}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!address,
    });

    const { claimed, recovered }: Payloads = useMemo(() => {
        const recovered: InputViewFunctionData[] = [];
        const claimed: InputViewFunctionData[] = [];

        if (!rawReimbursements) return { recovered, claimed };

        rawReimbursements.forEach((rawReimbursement) => {
            const chainData = getChainData(rawReimbursement.chainId);
            if (!chainData || !address) return null;

            const { metromContract: metrom } = chainData;
            const moveFunction: MoveFunctionId = `${metrom.address}::metrom::claimed_campaign_reward`;

            recovered.push({
                function: moveFunction,
                functionArguments: [
                    rawReimbursement.campaignId,
                    rawReimbursement.token.address,
                    zeroAddress,
                ],
            });
            claimed.push({
                function: moveFunction,
                functionArguments: [
                    rawReimbursement.campaignId,
                    rawReimbursement.token.address,
                    address,
                ],
            });
        });

        return { recovered, claimed } as Payloads;
    }, [address, rawReimbursements]);

    // reimbursements recovered are assigned to the zero address,
    // so we have to fetch them separately
    const {
        data: recoveredData,
        error: recoveredError,
        isError: recoveredErrored,
        isLoading: loadingRecovered,
    } = useQuery({
        queryKey: ["recovered-campaign-reimbursements", recovered],
        queryFn: async ({ queryKey }) => {
            const [, recoveredPayloads] = queryKey as [
                string,
                typeof recovered,
            ];

            if (!recoveredPayloads) return null;

            try {
                return await Promise.all(
                    recoveredPayloads.map((payload) =>
                        aptosClient.view({ payload }),
                    ),
                );
            } catch (error) {
                console.error(
                    `Could not fetch recovered campaign reimbursements: ${error}`,
                );
                throw error;
            }
        },
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: !!recovered && enabled,
    });

    const {
        data: claimedData,
        error: claimedError,
        isError: claimedErrored,
        isLoading: loadingClaimed,
    } = useQuery({
        queryKey: ["claimed-campaign-reimbursements", claimed],
        queryFn: async ({ queryKey }) => {
            const [, claimedPayloads] = queryKey as [string, typeof claimed];

            if (!claimedPayloads) return null;

            try {
                return await Promise.all(
                    claimedPayloads.map((payload) =>
                        aptosClient.view({ payload }),
                    ),
                );
            } catch (error) {
                console.error(
                    `Could not fetch claimed campaign reimbursements: ${error}`,
                );
                throw error;
            }
        },
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: !!claimed && enabled,
    });

    useEffect(() => {
        if (!address) return;
        if (reimbursementsErrored || recoveredErrored || claimedErrored) {
            console.error(
                `Could not fetch reimbursed data for address ${address}: ${recoveredError} ${claimedError}`,
            );
            setReimbursements([]);
            return;
        }
        if (loadingReimbursements || loadingRecovered || loadingClaimed) return;
        if (!rawReimbursements || !recoveredData || !claimedData) {
            setReimbursements([]);
            return;
        }

        const reimbursements: ReimbursementsWithRemaining[] = [];
        for (let i = 0; i < recoveredData.length; i++) {
            const rawRecovered = recoveredData[i] as unknown as number;
            const rawClaimed = claimedData[i] as unknown as number;
            const rawReimbursement = rawReimbursements[i];

            const rawRemaining =
                rawReimbursement.amount.raw -
                BigInt(rawRecovered) -
                BigInt(rawClaimed);
            const formattedRemaining = Number(
                formatUnits(rawRemaining, rawReimbursement.token.decimals),
            );

            if (formattedRemaining > 0) {
                reimbursements.push({
                    ...rawReimbursement,
                    remaining: {
                        raw: rawRemaining,
                        formatted: formattedRemaining,
                        usdValue:
                            formattedRemaining *
                            rawReimbursement.token.usdPrice,
                    },
                });
            }
        }

        setReimbursements(reimbursements);
    }, [
        address,
        recoveredData,
        recoveredError,
        recoveredErrored,
        loadingRecovered,
        loadingReimbursements,
        rawReimbursements,
        claimedData,
        loadingClaimed,
        claimedErrored,
        claimedError,
        reimbursementsErrored,
    ]);

    // Can be used to invalide the contract queries, to update the reimbursements
    // after a successful recovery.
    const invalidate = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: ["recovered-campaign-reimbursements"],
        });
        await queryClient.invalidateQueries({
            queryKey: ["claimed-campaign-reimbursements"],
        });
    }, [queryClient]);

    return {
        loading:
            (loadingReimbursements || loadingClaimed || loadingRecovered) &&
            !reimbursements,
        invalidate,
        reimbursements,
    };
}

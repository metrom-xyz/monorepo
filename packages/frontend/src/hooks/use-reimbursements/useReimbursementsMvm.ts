import { formatUnits, type Address } from "viem";
import { METROM_API_CLIENT } from "../../commons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReimbursementsWithRemaining } from "../../types/campaign";
import { getChainData } from "../../utils/chain";
import type { UseReimbursementsParams, UseReimbursementsReturnValue } from ".";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
    type InputViewFunctionData,
    type MoveFunctionId,
    AccountAddress,
} from "@aptos-labs/ts-sdk";
import { useClients } from "@aptos-labs/react";

interface Payloads {
    recovered: InputViewFunctionData[];
    claimed: InputViewFunctionData[];
}

type QueryKey = [string, Address | undefined];

export function useReimbursementsMvm({
    enabled = true,
}: UseReimbursementsParams = {}): UseReimbursementsReturnValue {
    const [reimbursements, setReimbursements] =
        useState<ReimbursementsWithRemaining[]>();

    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { aptos } = useClients();

    const address = account?.address.toStringLong();

    const {
        data: rawReimbursements,
        isError: reimbursementsErrored,
        isLoading: loadingReimbursements,
    } = useQuery({
        queryKey: ["reimbursements", address],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as QueryKey;
            if (!account) return null;

            try {
                const rawClaims = await METROM_API_CLIENT.fetchReimbursements({
                    address: account,
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
                    AccountAddress.fromString(
                        rawReimbursement.campaignId,
                    ).bcsToBytes(),
                    rawReimbursement.token.address,
                    AccountAddress.from("0x0").toStringLong(),
                ],
            });
            claimed.push({
                function: moveFunction,
                functionArguments: [
                    AccountAddress.fromString(
                        rawReimbursement.campaignId,
                    ).bcsToBytes(),
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
                    recoveredPayloads.map((payload) => aptos.view({ payload })),
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
                    claimedPayloads.map((payload) => aptos.view({ payload })),
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
            const rawRecovered = recoveredData[i][0] as unknown as number;
            const rawClaimed = claimedData[i][0] as unknown as number;
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

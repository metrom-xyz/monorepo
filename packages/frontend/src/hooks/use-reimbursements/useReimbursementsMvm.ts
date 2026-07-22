import { type Address } from "viem";
import { METROM_API_CLIENT } from "../../commons";
import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReimbursementsWithRemaining } from "../../types/campaign/common";
import { chainIdToAptosNetwork, getChainData } from "../../utils/chain";
import type { UseReimbursementsParams, UseReimbursementsReturnValue } from ".";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
    type InputViewFunctionData,
    type MoveFunctionId,
    AccountAddress,
} from "@aptos-labs/ts-sdk";
import { useClients } from "@aptos-labs/react";
import { formatUnits } from "@/src/utils/format";
import { ChainType } from "@metrom-xyz/sdk";

interface Payloads {
    recovered: InputViewFunctionData[];
    claimed: InputViewFunctionData[];
}

type QueryKey = [string, ChainType, Address | undefined];

export function useReimbursementsMvm({
    enabled = true,
}: UseReimbursementsParams = {}): UseReimbursementsReturnValue {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { aptos } = useClients();

    const address = account?.address.toStringLong();

    const {
        data: rawReimbursements,
        isError: reimbursementsErrored,
        isLoading: loadingReimbursements,
    } = useQuery({
        queryKey: ["reimbursements", ChainType.Aptos, address],
        queryFn: async ({ queryKey }) => {
            const [, , account] = queryKey as QueryKey;
            if (!account) return null;

            try {
                const rawReimbursements =
                    await METROM_API_CLIENT.fetchReimbursements({
                        address: account,
                    });

                return rawReimbursements.filter(
                    ({ chainId, chainType }) =>
                        chainType === ChainType.Aptos &&
                        !!chainIdToAptosNetwork(chainId),
                );
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

    const payloads: Payloads | undefined = useMemo(() => {
        if (!rawReimbursements || !address) return undefined;

        const recovered: InputViewFunctionData[] = [];
        const claimed: InputViewFunctionData[] = [];

        rawReimbursements.forEach((rawReimbursement) => {
            const chainData = getChainData(rawReimbursement.chainId);
            if (!chainData) return;

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

        return { recovered, claimed };
    }, [address, rawReimbursements]);

    // reimbursements recovered are assigned to the zero address,
    // so we have to fetch them separately
    const {
        data: recoveredData,
        error: recoveredError,
        isError: recoveredErrored,
        isLoading: loadingRecovered,
    } = useQuery({
        queryKey: [
            "recovered-campaign-reimbursements",
            ChainType.Aptos,
            payloads?.recovered,
        ],
        queryFn: async ({ queryKey }) => {
            const [, , recoveredPayloads] = queryKey as [
                string,
                ChainType,
                InputViewFunctionData[] | undefined,
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
        enabled: enabled && !!payloads,
    });

    const {
        data: claimedData,
        error: claimedError,
        isError: claimedErrored,
        isLoading: loadingClaimed,
    } = useQuery({
        queryKey: [
            "claimed-campaign-reimbursements",
            ChainType.Aptos,
            payloads?.claimed,
        ],
        queryFn: async ({ queryKey }) => {
            const [, , claimedPayloads] = queryKey as [
                string,
                ChainType,
                InputViewFunctionData[] | undefined,
            ];

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
        enabled: enabled && !!payloads,
    });

    const reimbursements = useMemo<ReimbursementsWithRemaining[] | undefined>(
        () => {
            if (!address) return undefined;
            if (reimbursementsErrored || recoveredErrored || claimedErrored) {
                console.error(
                    `Could not fetch reimbursed data for address ${address}: ${recoveredError} ${claimedError}`,
                );
                return [];
            }
            if (loadingReimbursements || loadingRecovered || loadingClaimed)
                return undefined;
            if (!rawReimbursements || !recoveredData || !claimedData)
                return [];

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

            return reimbursements;
        },
        [
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
        ],
    );

    // Can be used to invalide the contract queries, to update the reimbursements
    // after a successful recovery.
    const invalidate = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: ["recovered-campaign-reimbursements", ChainType.Aptos],
        });
        await queryClient.invalidateQueries({
            queryKey: ["claimed-campaign-reimbursements", ChainType.Aptos],
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

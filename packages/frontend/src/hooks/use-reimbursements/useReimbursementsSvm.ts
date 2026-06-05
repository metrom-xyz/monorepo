import { METROM_API_CLIENT } from "../../commons";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReimbursementsWithRemaining } from "../../types/campaign/common";
import { getChainData } from "../../utils/chain";
import type { UseReimbursementsParams, UseReimbursementsReturnValue } from ".";
import { useChainWithType } from "../useChainWithType";
import { useSolanaClient } from "@solana/react-hooks";
import {
    findUserClaimedRewardPda,
    findUserReimbursedRewardPda,
    getClaimedRewardDecoder,
} from "@metrom-xyz/programs-solana/client";
import { getBase64Encoder, type Address } from "@solana/kit";
import { formatUnits } from "@/src/utils/format";
import { useAccount } from "../useAccount";

type QueryKey = [string, Address | undefined];

interface ClaimedRecoveredPda {
    claimed: Address<string>;
    recovered: Address<string>;
}

export function useReimbursementsSvm({
    enabled = true,
}: UseReimbursementsParams = {}): UseReimbursementsReturnValue {
    const [reimbursements, setReimbursements] =
        useState<ReimbursementsWithRemaining[]>();
    const [recoveredPdas, setRecoveredPdas] = useState<Address[]>();
    const [claimedPdas, setClaimedPdas] = useState<Address[]>();

    const queryClient = useQueryClient();
    const { address } = useAccount();
    const client = useSolanaClient();
    const { id: chainId } = useChainWithType();

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

    const {
        data: recoveredData,
        error: recoveredError,
        isError: recoveredErrored,
        isLoading: loadingRecovered,
    } = useQuery({
        queryKey: ["recovered-campaign-reimbursements", recoveredPdas],
        queryFn: async ({ queryKey }) => {
            const [, recoveredAccounts] = queryKey as [
                string,
                typeof recoveredPdas,
            ];

            if (!recoveredAccounts) return null;

            try {
                const accounts = await client.runtime.rpc
                    .getMultipleAccounts(recoveredAccounts, {
                        encoding: "base64",
                    })
                    .send();

                return accounts.value.map((value) => {
                    // FIXME: if there's no value is it because the account doesn't exist, or because it exists but has no data?
                    // Should we handle this differently?
                    if (!value) return 0n;

                    return getClaimedRewardDecoder().decode(
                        getBase64Encoder().encode(value.data[0]),
                    ).claimed;
                });
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
        enabled: !!recoveredPdas && enabled,
    });

    const {
        data: claimedData,
        error: claimedError,
        isError: claimedErrored,
        isLoading: loadingClaimed,
    } = useQuery({
        queryKey: ["claimed-campaign-reimbursements", claimedPdas],
        queryFn: async ({ queryKey }) => {
            const [, claimedAccounts] = queryKey as [
                string,
                typeof claimedPdas,
            ];

            if (!claimedAccounts) return null;

            try {
                const accounts = await client.runtime.rpc
                    .getMultipleAccounts(claimedAccounts, {
                        encoding: "base64",
                    })
                    .send();

                return accounts.value.map((value) => {
                    // FIXME: if there's no value is it because the account doesn't exist, or because it exists but has no data?
                    // Should we handle this differently?
                    if (!value) return 0n;

                    return getClaimedRewardDecoder().decode(
                        getBase64Encoder().encode(value.data[0]),
                    ).claimed;
                });
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
        enabled: !!claimedPdas && enabled,
    });

    useEffect(() => {
        const fetchReimbursements = async () => {
            const recovered: Address[] = [];
            const claimed: Address[] = [];

            if (!rawReimbursements || !address) return { recovered, claimed };

            const filtered = rawReimbursements.filter(
                (r) => r.chainId === chainId,
            );

            const pdas = await Promise.all(
                filtered.map(async (rawReimbursement) => {
                    const chainData = getChainData(rawReimbursement.chainId);
                    if (!chainData || !address) return null;

                    const claimedPda = await findUserClaimedRewardPda({
                        signer: address as Address,
                        campaign: rawReimbursement.campaignId as Address,
                    });

                    const recoveredPda = await findUserReimbursedRewardPda({
                        signer: address as Address,
                        campaign: rawReimbursement.campaignId as Address,
                    });

                    return {
                        claimed: claimedPda[0],
                        recovered: recoveredPda[0],
                    };
                }),
            );

            const validPdas = pdas.filter(
                (pda): pda is ClaimedRecoveredPda => !!pda,
            );
            setRecoveredPdas(validPdas.map((p) => p.recovered));
            setClaimedPdas(validPdas.map((p) => p.claimed));
        };

        void fetchReimbursements();
    }, [address, rawReimbursements, chainId]);

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
            const rawRecovered = recoveredData[i];
            const rawClaimed = claimedData[i];
            const rawReimbursement = rawReimbursements[i];

            const rawRemaining =
                rawReimbursement.amount.raw - rawRecovered - rawClaimed;

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

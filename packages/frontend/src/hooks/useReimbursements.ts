import { useAccount, useReadContracts } from "wagmi";
import { formatUnits, type Address, zeroAddress } from "viem";
import { CHAIN_DATA, METROM_API_CLIENT } from "../commons";
import { SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { ReimbursementsWithRemaining } from "../types/campaign";

interface UseReimbursementsParams extends HookBaseParams {}

interface UseReimbursementsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    reimbursements?: ReimbursementsWithRemaining[];
}

type QueryKey = [string, Address | undefined];

export function useReimbursements({
    enabled = true,
}: UseReimbursementsParams = {}): UseReimbursementsReturnValue {
    const [reimbursements, setReimbursements] =
        useState<ReimbursementsWithRemaining[]>();

    const queryClient = useQueryClient();
    const { address } = useAccount();

    const {
        data: rawReimbursements,
        isError: reimbursementsErrored,
        isLoading: loadingReimbursements,
    } = useQuery({
        queryKey: ["reimbursements", address],
        queryFn: async ({ queryKey }) => {
            const [, address] = queryKey as QueryKey;
            if (!address) return null;

            try {
                const rawClaims = await METROM_API_CLIENT.fetchReimbursements({
                    address,
                });
                return rawClaims;
            } catch (error) {
                console.error(
                    `Could not fetch raw reimbursements for address ${address}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!address,
    });

    const recoveredContracts = useMemo(() => {
        if (!rawReimbursements) return undefined;

        return rawReimbursements.map((rawReimbursement) => {
            return {
                chainId: rawReimbursement.chainId,
                address:
                    CHAIN_DATA[rawReimbursement.chainId as SupportedChain]
                        ?.metromContract.address,
                abi: metromAbi,
                functionName: "claimedCampaignReward",
                args: [
                    rawReimbursement.campaignId,
                    rawReimbursement.token.address,
                    zeroAddress,
                ],
            };
        });
    }, [rawReimbursements]);

    const claimedContracts = useMemo(() => {
        if (!rawReimbursements) return undefined;

        return rawReimbursements.map((rawReimbursement) => {
            return {
                chainId: rawReimbursement.chainId,
                address:
                    CHAIN_DATA[rawReimbursement.chainId as SupportedChain]
                        ?.metromContract.address,
                abi: metromAbi,
                functionName: "claimedCampaignReward",
                args: [
                    rawReimbursement.campaignId,
                    rawReimbursement.token.address,
                    address,
                ],
            };
        });
    }, [address, rawReimbursements]);

    // reimbursements recovered are assigned to the zero address,
    // so we have to fetch them separately
    const {
        data: recoveredData,
        queryKey: recoveredQueryKey,
        error: recoveredError,
        isError: recoveredErrored,
        isLoading: loadingRecovered,
    } = useReadContracts({
        allowFailure: false,
        contracts: recoveredContracts,
        query: {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!recoveredContracts,
        },
    });

    const {
        data: claimedData,
        queryKey: claimedQueryKey,
        error: claimedError,
        isError: claimedErrored,
        isLoading: loadingClaimed,
    } = useReadContracts({
        allowFailure: false,
        contracts: claimedContracts,
        query: {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!claimedContracts,
        },
    });

    useEffect(() => {
        if (!address) return;
        if (reimbursementsErrored || recoveredErrored || claimedErrored) {
            console.error(
                `Could not fetch claimed data for address ${address}: ${recoveredError} ${claimedError}`,
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
            const rawRecovered = recoveredData[i] as unknown as bigint;
            const rawClaimed = claimedData[i] as unknown as bigint;
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
        await queryClient.invalidateQueries({ queryKey: recoveredQueryKey });
        await queryClient.invalidateQueries({ queryKey: claimedQueryKey });
    }, [queryClient, recoveredQueryKey, claimedQueryKey]);

    return {
        loading:
            loadingReimbursements ||
            loadingClaimed ||
            loadingRecovered ||
            !reimbursements,
        invalidate,
        reimbursements,
    };
}

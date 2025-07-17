import { useAccount, useConfig } from "wagmi";
import { formatUnits, type Address, zeroAddress } from "viem";
import { METROM_API_CLIENT } from "../../commons";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { HookBaseParams } from "../../types/hooks";
import type { ReimbursementsWithRemaining } from "../../types/campaign";
import { getChainData } from "../../utils/chain";
import { readContracts } from "@wagmi/core";

interface UseReimbursementsParams extends HookBaseParams {}

interface UseReimbursementsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    reimbursements?: ReimbursementsWithRemaining[];
}

type QueryKey = [string, Address | undefined];

export function useReimbursementsEvm({
    enabled = true,
}: UseReimbursementsParams = {}): UseReimbursementsReturnValue {
    const [reimbursements, setReimbursements] =
        useState<ReimbursementsWithRemaining[]>();

    const config = useConfig();
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

        return rawReimbursements
            .map((rawReimbursement) => {
                const chainData = getChainData(rawReimbursement.chainId);
                if (!chainData) return null;

                return {
                    chainId: rawReimbursement.chainId,
                    address: chainData.metromContract.address,
                    abi: metromAbi,
                    functionName: "claimedCampaignReward",
                    args: [
                        rawReimbursement.campaignId,
                        rawReimbursement.token.address,
                        zeroAddress,
                    ],
                };
            })
            .filter((reimbursement) => !!reimbursement);
    }, [rawReimbursements]);

    const claimedContracts = useMemo(() => {
        if (!rawReimbursements) return undefined;

        return rawReimbursements
            .map((rawReimbursement) => {
                const chainData = getChainData(rawReimbursement.chainId);
                if (!chainData) return null;

                return {
                    chainId: rawReimbursement.chainId,
                    address: chainData.metromContract.address,
                    abi: metromAbi,
                    functionName: "claimedCampaignReward",
                    args: [
                        rawReimbursement.campaignId,
                        rawReimbursement.token.address,
                        address,
                    ],
                };
            })
            .filter((reimbursement) => !!reimbursement);
    }, [address, rawReimbursements]);

    // reimbursements recovered are assigned to the zero address,
    // so we have to fetch them separately
    const {
        data: recoveredData,
        error: recoveredError,
        isError: recoveredErrored,
        isLoading: loadingRecovered,
    } = useQuery({
        queryKey: ["recovered-campaign-reimbursements", recoveredContracts],
        queryFn: async ({ queryKey }) => {
            const [, contracts] = queryKey as [
                string,
                typeof recoveredContracts,
            ];

            if (!contracts) return null;

            try {
                return await readContracts(config, {
                    allowFailure: false,
                    contracts,
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
        enabled: !!recoveredContracts && enabled,
    });

    const {
        data: claimedData,
        error: claimedError,
        isError: claimedErrored,
        isLoading: loadingClaimed,
    } = useQuery({
        queryKey: ["claimed-campaign-reimbursements", claimedContracts],
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
                    `Could not fetch claimed campaign reimbursements: ${error}`,
                );
                throw error;
            }
        },
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: !!claimedContracts && enabled,
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

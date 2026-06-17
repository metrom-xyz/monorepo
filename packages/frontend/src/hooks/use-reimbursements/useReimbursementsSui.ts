import { useCallback, useEffect, useState } from "react";
import type { UseReimbursementsParams, UseReimbursementsReturnValue } from ".";
import type { ReimbursementsWithRemaining } from "../../types/campaign/common";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentClient } from "@mysten/dapp-kit-react";
import { METROM_API_CLIENT } from "../../commons";
import { getChainData } from "../../utils/chain";
import { claimedCampaignReward } from "@metrom-xyz/sui-contracts/client";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { fromHex } from "@mysten/sui/utils";
import { useAccount } from "../useAccount";
import { formatUnits } from "../../utils/format";

const SUI_ZERO_ADDRESS =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

type ReimbursementsQueryKey = [string, string | undefined];

export function useReimbursementsSui({
    enabled = true,
}: UseReimbursementsParams = {}): UseReimbursementsReturnValue {
    const [reimbursements, setReimbursements] =
        useState<ReimbursementsWithRemaining[]>();

    const queryClient = useQueryClient();
    const client = useCurrentClient();
    const { address } = useAccount();

    const {
        data: rawReimbursements,
        isError: reimbursementsErrored,
        isLoading: loadingReimbursements,
    } = useQuery({
        queryKey: ["reimbursements", address],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as ReimbursementsQueryKey;
            if (!account) return null;

            try {
                return await METROM_API_CLIENT.fetchReimbursements({
                    address: account,
                });
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
        data: reimbursementData,
        error: reimbursementDataError,
        isLoading: loadingReimbursementData,
        isError: reimbursementDataErrored,
    } = useQuery({
        queryKey: ["reimbursements-data-sui", address, rawReimbursements],
        queryFn: async () => {
            if (!rawReimbursements || !address) return null;

            const txRecovered = new Transaction();
            txRecovered.setSender(address);

            const txClaimed = new Transaction();
            txClaimed.setSender(address);

            const includedIndices: number[] = [];

            for (let i = 0; i < rawReimbursements.length; i++) {
                const rawReimbursement = rawReimbursements[i];
                const chainData = getChainData(rawReimbursement.chainId);
                if (!chainData || !chainData.metromContract.stateAddress)
                    continue;

                includedIndices.push(i);

                const campaignIdBytes = Array.from(
                    fromHex(rawReimbursement.campaignId),
                );
                const addressWithoutPrefix =
                    rawReimbursement.token.address.replace(/^0x/, "");

                claimedCampaignReward({
                    package: chainData.metromContract.address,
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        id: campaignIdBytes,
                        token: txRecovered.pure.string(addressWithoutPrefix),
                        account: SUI_ZERO_ADDRESS,
                    },
                })(txRecovered);

                claimedCampaignReward({
                    package: chainData.metromContract.address,
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        id: campaignIdBytes,
                        token: txClaimed.pure.string(addressWithoutPrefix),
                        account: address,
                    },
                })(txClaimed);
            }

            const recovered = rawReimbursements.map(() => 0n);
            const claimed = rawReimbursements.map(() => 0n);

            if (includedIndices.length === 0) return { recovered, claimed };

            const [resultRecovered, resultClaimed] = await Promise.all([
                client.simulateTransaction({
                    transaction: txRecovered,
                    checksEnabled: false,
                    include: { commandResults: true },
                }),
                client.simulateTransaction({
                    transaction: txClaimed,
                    checksEnabled: false,
                    include: { commandResults: true },
                }),
            ]);

            resultRecovered.commandResults.forEach((result, i) => {
                const reimbursementIndex = includedIndices[i];
                if (reimbursementIndex === undefined) return;

                const output = result.returnValues[0];
                if (!output || !output.bcs) return;

                recovered[reimbursementIndex] = BigInt(
                    bcs.u64().parse(output.bcs),
                );
            });

            resultClaimed.commandResults.forEach((result, i) => {
                const reimbursementIndex = includedIndices[i];
                if (reimbursementIndex === undefined) return;

                const output = result.returnValues[0];
                if (!output || !output.bcs) return;

                claimed[reimbursementIndex] = BigInt(
                    bcs.u64().parse(output.bcs),
                );
            });

            return { recovered, claimed };
        },
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled:
            enabled &&
            !!address &&
            !!rawReimbursements &&
            rawReimbursements.length > 0,
    });

    useEffect(() => {
        if (!address) {
            setReimbursements([]);
            return;
        }
        if (reimbursementsErrored || reimbursementDataErrored) {
            console.error(
                `Could not fetch reimbursement data for address ${address}: ${reimbursementDataError}`,
            );
            setReimbursements([]);
            return;
        }
        if (loadingReimbursements || loadingReimbursementData) return;
        if (!rawReimbursements || !reimbursementData) {
            setReimbursements([]);
            return;
        }

        const { recovered, claimed } = reimbursementData;

        const reimbursements: ReimbursementsWithRemaining[] = [];
        for (let i = 0; i < rawReimbursements.length; i++) {
            const rawReimbursement = rawReimbursements[i];
            const rawRemaining =
                rawReimbursement.amount.raw - recovered[i] - claimed[i];
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
        reimbursementData,
        reimbursementDataError,
        reimbursementDataErrored,
        reimbursementsErrored,
        loadingReimbursementData,
        loadingReimbursements,
        rawReimbursements,
    ]);

    const invalidate = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: ["reimbursements-data-sui"],
        });
    }, [queryClient]);

    return {
        loading:
            (loadingReimbursements || loadingReimbursementData) &&
            !reimbursements,
        invalidate,
        reimbursements,
    };
}

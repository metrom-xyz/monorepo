import { useAccount, useReadContracts } from "wagmi";
import { formatUnits, type Address, zeroAddress } from "viem";
import { CHAIN_DATA, metromApiClient } from "../commons";
import { type OnChainAmount, type Reimbursement } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface ReimbursementsWithRemaining extends Reimbursement {
    remaining: OnChainAmount;
}

export function useReimbursements(): {
    loading: boolean;
    reimbursements: Reimbursement[];
} {
    const [reimbursements, setReimbursements] = useState<
        ReimbursementsWithRemaining[]
    >([]);

    const { address } = useAccount();

    const { data: rawReimbursements, isLoading: loadingReimbursements } =
        useQuery({
            queryKey: ["reimbursements", address],
            queryFn: async ({ queryKey }) => {
                const account = queryKey[1];
                if (!account) return undefined;

                try {
                    const rawClaims = await metromApiClient.fetchReimbursements(
                        {
                            address: account as Address,
                        },
                    );
                    return rawClaims;
                } catch (error) {
                    throw new Error(
                        `Could not fetch raw reimbursements for address ${address}: ${error}`,
                    );
                }
            },
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!address,
        });

    // reimbursements recovered are assigned to the zero address,
    // so we have to fetch them separately
    const {
        isLoading: loadingRecovered,
        data: recoveredData,
        isError: recoveredErrored,
        error: recoveredError,
    } = useReadContracts({
        allowFailure: false,
        contracts:
            rawReimbursements &&
            rawReimbursements.map((rawReimbursement) => {
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
            }),
        query: {
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!rawReimbursements,
        },
    });

    const {
        isLoading: loadingClaimed,
        data: claimedData,
        isError: claimedErrored,
        error: claimedError,
    } = useReadContracts({
        allowFailure: false,
        contracts:
            rawReimbursements &&
            rawReimbursements.map((rawReimbursement) => {
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
            }),
        query: {
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!rawReimbursements,
        },
    });

    useEffect(() => {
        if (loadingReimbursements || loadingRecovered || loadingClaimed) return;
        if (recoveredErrored || claimedErrored) {
            console.error(
                `Could not fetch claimed data for address ${address}: ${recoveredError} ${claimedError}`,
            );
            return;
        }
        if (!rawReimbursements || !recoveredData || !claimedData) {
            setReimbursements([]);
            return;
        }

        const reimbursements = [];
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
                    remaining: <OnChainAmount>{
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
    ]);

    return {
        loading: loadingReimbursements || loadingRecovered,
        reimbursements,
    };
}

import { useAccount, useReadContracts } from "wagmi";
import { formatUnits, type Address, zeroAddress } from "viem";
import { CHAIN_DATA, METROM_API_CLIENT } from "../commons";
import { type OnChainAmount, type Reimbursement } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";

interface ReimbursementsWithRemaining extends Reimbursement {
    remaining: OnChainAmount;
}

interface UseReimbursementsParams extends HookBaseParams {}

type QueryKey = [string, Address | undefined];

export function useReimbursements({
    enabled = true,
}: UseReimbursementsParams = {}): {
    loadingReimbursements: boolean;
    loadingRecovered: boolean;
    loadingClaimed: boolean;
    reimbursements: Reimbursement[];
} {
    const [reimbursements, setReimbursements] = useState<
        ReimbursementsWithRemaining[]
    >([]);

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

    // reimbursements recovered are assigned to the zero address,
    // so we have to fetch them separately
    const {
        data: recoveredData,
        error: recoveredError,
        isError: recoveredErrored,
        isLoading: loadingRecovered,
    } = useReadContracts({
        allowFailure: false,
        contracts: rawReimbursements
            ? rawReimbursements.map((rawReimbursement) => {
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
              })
            : undefined,
        query: {
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!rawReimbursements,
        },
    });

    const {
        data: claimedData,
        error: claimedError,
        isError: claimedErrored,
        isLoading: loadingClaimed,
    } = useReadContracts({
        allowFailure: false,
        contracts: rawReimbursements
            ? rawReimbursements.map((rawReimbursement) => {
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
              })
            : undefined,
        query: {
            refetchOnWindowFocus: false,
            staleTime: 60000,
            enabled: !!rawReimbursements,
        },
    });

    useEffect(() => {
        if (loadingReimbursements || loadingRecovered || loadingClaimed) {
            return;
        }
        if (reimbursementsErrored || recoveredErrored || claimedErrored) {
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
        reimbursementsErrored,
    ]);

    return {
        loadingReimbursements,
        loadingRecovered,
        loadingClaimed,
        reimbursements,
    };
}

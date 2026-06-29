import { useCallback, useEffect, useState } from "react";
import type { UseClaimsParams, UseClaimsReturnValue } from ".";
import type { ClaimWithRemaining } from "@/src/types/campaign/common";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentClient } from "@mysten/dapp-kit-react";
import { METROM_API_CLIENT } from "@/src/commons";
import { getChainData } from "@/src/utils/chain";
import { claimedCampaignReward } from "@metrom-xyz/sui-contracts/client";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { fromHex } from "@mysten/sui/utils";
import { useAccount } from "../useAccount";
import { formatUnits } from "@/src/utils/format";

type ClaimsQueryKey = [string, string | undefined];

export function useClaimsSui({
    enabled = true,
}: UseClaimsParams = {}): UseClaimsReturnValue {
    const [claims, setClaims] = useState<ClaimWithRemaining[]>();

    const queryClient = useQueryClient();
    const client = useCurrentClient();
    const { address } = useAccount();

    const {
        data: rawClaims,
        isError: claimsErrored,
        isLoading: loadingClaims,
    } = useQuery({
        queryKey: ["claims", address],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as ClaimsQueryKey;
            if (!account) return null;

            try {
                return await METROM_API_CLIENT.fetchClaims({
                    address: account,
                });
            } catch (error) {
                console.error(
                    `Could not fetch raw claims for address ${account}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!address,
    });

    const {
        data: claimedData,
        error: claimedError,
        isLoading: loadingClaimed,
        isError: claimedErrored,
    } = useQuery({
        queryKey: ["claimed-campaign-rewards", address, rawClaims],
        queryFn: async () => {
            if (!rawClaims || !address) return null;

            const tx = new Transaction();
            tx.setSender(address);

            const callToClaimIndex: number[] = [];

            for (let i = 0; i < rawClaims.length; i++) {
                const rawClaim = rawClaims[i];
                const chainData = getChainData(rawClaim.chainId);
                if (!chainData || !chainData.metromContract.stateAddress)
                    continue;

                callToClaimIndex.push(i);

                claimedCampaignReward({
                    package: chainData.metromContract.address,
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        id: Array.from(fromHex(rawClaim.campaignId)),
                        token: tx.pure.string(
                            rawClaim.token.address.replace(/^0x/, ""),
                        ),
                        account: address,
                    },
                })(tx);
            }

            const claimedAmounts = rawClaims.map(() => 0n);

            if (callToClaimIndex.length === 0) return claimedAmounts;

            try {
                const result = await client.simulateTransaction({
                    transaction: tx,
                    checksEnabled: false,
                    include: { commandResults: true },
                });

                result.commandResults.forEach((result, i) => {
                    const claimIndex = callToClaimIndex[i];
                    if (claimIndex === undefined) return;

                    const output = result.returnValues[0];
                    if (!output || !output.bcs) return;

                    claimedAmounts[claimIndex] = BigInt(
                        bcs.u64().parse(output.bcs),
                    );
                });
            } catch (error) {
                console.error(
                    `Could not fetch claimed campaign rewards: ${error}`,
                );
                throw error;
            }

            return claimedAmounts;
        },
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!address && !!rawClaims && rawClaims.length > 0,
    });

    useEffect(() => {
        if (!address) {
            setClaims([]);
            return;
        }
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
        for (let i = 0; i < rawClaims.length; i++) {
            const rawClaimed = claimedData[i];
            const rawClaim = rawClaims[i];

            const rawRemaining = rawClaim.amount.raw - rawClaimed;
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

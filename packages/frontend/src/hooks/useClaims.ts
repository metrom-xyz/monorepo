import { useAccount, useBlockNumber, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { CHAIN_DATA, metromApiClient } from "../commons";
import { SupportedChain, type Claim } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useQueryClient } from "@tanstack/react-query";

interface ClaimWithRemaining extends Claim {
    remaining: number;
}

export function useClaims(): {
    loading: boolean;
    claims: Claim[];
} {
    const { address } = useAccount();

    const [rawClaims, setRawClaims] = useState<Claim[]>([]);
    const [claims, setClaims] = useState<ClaimWithRemaining[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!address) return;

            if (!cancelled) setLoading(false);
            if (!cancelled) setRawClaims([]);

            try {
                if (!cancelled) setLoading(true);
                const rawClaims = await metromApiClient.fetchClaims({
                    address,
                });
                if (!cancelled) setRawClaims(rawClaims);
            } catch (error) {
                console.error(
                    `Could not fetch raw claims for address ${address}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [address]);

    const queryClient = useQueryClient();
    const { data: blockNumber, queryKey } = useBlockNumber({ watch: true });
    const {
        isLoading: loadingClaimed,
        data: claimedData,
        isError: claimedErrored,
        error: claimedError,
    } = useReadContracts({
        allowFailure: false,
        contracts: rawClaims.map((rawClaim) => {
            return {
                chainId: rawClaim.chainId,
                address:
                    CHAIN_DATA[rawClaim.chainId as SupportedChain].contract
                        .address,
                abi: metromAbi,
                functionName: "claimedCampaignReward",
                args: [rawClaim.campaignId, rawClaim.token.address, address],
            };
        }),
    });

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey });
    }, [blockNumber, queryClient]);

    useEffect(() => {
        if (loadingClaimed) return;
        if (claimedErrored) {
            console.error(
                `Could not fetch claimed data for address ${address}: ${claimedError}`,
            );
            return;
        }
        if (!claimedData) return;

        const claims = [];
        for (let i = 0; i < claimedData.length; i++) {
            const rawClaimed = claimedData[i] as unknown as bigint;
            const rawClaim = rawClaims[i];
            const claimed = Number(
                formatUnits(rawClaimed, rawClaim.token.decimals),
            );
            const remaining = rawClaim.amount - claimed;
            if (remaining > 0) {
                claims.push({
                    ...rawClaim,
                    remaining: rawClaim.amount - claimed,
                });
            }
        }

        setClaims(claims);
    }, [
        address,
        claimedData,
        claimedError,
        claimedErrored,
        loadingClaimed,
        rawClaims,
    ]);

    return {
        loading: loading || loadingClaimed,
        claims,
    };
}

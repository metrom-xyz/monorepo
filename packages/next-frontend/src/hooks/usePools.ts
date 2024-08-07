import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { CHAIN_DATA } from "../commons";
import { SupportedAmm, type Pool } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";

export function usePools(ammSlug?: string): {
    loading: boolean;
    pools: Pool[];
} {
    const chainId: SupportedChain = useChainId();

    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setPools([]);

            if (!ammSlug) return;

            try {
                if (!cancelled) setLoading(true);
                const pools = await CHAIN_DATA[
                    chainId
                ].metromApiClient.fetchPools({
                    amm: ammSlug as SupportedAmm,
                });
                if (!cancelled) setPools(pools);
            } catch (error) {
                console.error(`Could not fetch pools for amm ${ammSlug}`);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [ammSlug, chainId]);

    return {
        loading,
        pools,
    };
}
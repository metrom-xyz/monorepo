import type { Pool } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";
import { type Address } from "viem";

export interface UsePoolsParams {
    ammSlug?: string;
}

export interface UsePoolsReturnType {
    loading: boolean;
    error: Error | undefined;
    pools: Pool[];
}

export function usePools({ ammSlug }: UsePoolsParams): UsePoolsReturnType {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        let cancelled = false;

        const fetchPools = async () => {
            if (!ammSlug) return;
            if (!cancelled) setLoading(true);
            try {
                // TODO: use sdk to call backend API
                const pools = await Promise.resolve(
                    Array.from({ length: 100 }).map(
                        () =>
                            ({
                                address:
                                    "0x4584e008a59e15070CA3e748078A02A71037BE6d" as Address,
                                amm: ammSlug,
                                token0: {
                                    address:
                                        "0x4584e008a59e15070CA3e748078A02A71037BE6d" as Address,
                                    chainId: 1,
                                    decimals: 18,
                                    name: "SYMBOL",
                                    symbol: "SYM",
                                },
                                token1: {
                                    address:
                                        "0x1317106dd45ff0eb911e9f0af78d63fbf9076f69" as Address,
                                    chainId: 1,
                                    decimals: 18,
                                    name: "GASP",
                                    symbol: "GSP",
                                },
                                usdTvl: 1000,
                                fee: 100,
                            }) as Pool,
                    ),
                );
                if (!cancelled) setPools(pools);
            } catch (error) {
                console.warn(`could not fetch pools`, error);
                setError(error as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchPools();
        return () => {
            cancelled = true;
        };
    }, [ammSlug]);

    return { pools, loading, error };
}

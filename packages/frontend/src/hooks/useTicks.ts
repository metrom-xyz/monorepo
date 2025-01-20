import { type AmmPool, type InitializedTicks } from "@metrom-xyz/sdk";
import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";

const SURROUNDING_AMOUNT = 200;

export function useTicks(
    pool?: AmmPool,
    computeAmount?: number,
): {
    loading: boolean;
    ticks?: InitializedTicks;
} {
    const { data, isPending } = useQuery({
        queryKey: ["ticks", pool],
        queryFn: async ({ queryKey }) => {
            const pool = queryKey[1] as AmmPool;
            if (!pool) return undefined;

            const chainId = pool.chainId;

            try {
                return metromApiClient.fetchInitializedTicks({
                    chainId,
                    pool,
                    surroundingAmount: SURROUNDING_AMOUNT,
                    computeAmount,
                });
            } catch (error) {
                throw new Error(
                    `Could not fetch initialized ticks for pool with address ${pool.address} in chain with id ${chainId}: ${error}`,
                );
            }
        },
        enabled: !!pool,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isPending,
        ticks: data,
    };
}

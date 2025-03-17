import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { type AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

export function usePool(
    chainId: SupportedChain,
    address?: Address,
): {
    loading: boolean;
    pool?: AmmPoolWithTvl | null;
} {
    const { data: pool, isFetching: loading } = useQuery({
        queryKey: ["pool", chainId, address],
        queryFn: async ({ queryKey }) => {
            const chainId = queryKey[1] as SupportedChain | undefined;
            const address = queryKey[2] as Address | undefined;
            if (!chainId || !address) return undefined;

            try {
                return await METROM_API_CLIENT.fetchPool({
                    chainId,
                    address,
                });
            } catch (error) {
                console.error(
                    `Could not fetch pools with address ${address}: ${error}`,
                );
                throw error;
            }
        },
        enabled: !!address,
        staleTime: 0,
    });

    return {
        loading,
        pool,
    };
}

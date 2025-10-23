import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { ChainType, type AmmPool } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { Address, Hex } from "viem";
import type { HookBaseParams } from "../types/hooks";

interface UsePoolParams extends HookBaseParams {
    chainId?: SupportedChain;
    chainType?: ChainType;
    id?: Hex;
}

type QueryKey = [
    string,
    SupportedChain | undefined,
    ChainType | undefined,
    Address | undefined,
];

export function usePool({
    chainId,
    chainType,
    id,
    enabled = true,
}: UsePoolParams): {
    loading: boolean;
    pool?: AmmPool | undefined;
} {
    const { data: pool, isFetching: loading } = useQuery({
        queryKey: ["pool", chainId, chainType, id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType, id] = queryKey as QueryKey;
            if (!chainId || !chainType || !id) return null;

            try {
                return await METROM_API_CLIENT.fetchPool({
                    chainId,
                    chainType,
                    id,
                });
            } catch (error) {
                console.error(
                    `Could not fetch pool with id ${id} in chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!id,
        staleTime: 30000,
        refetchOnWindowFocus: false,
    });

    return {
        loading,
        pool: pool || undefined,
    };
}

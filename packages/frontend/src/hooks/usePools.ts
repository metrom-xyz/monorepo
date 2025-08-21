import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { ChainType, SupportedDex, type AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { useProtocolsInChain } from "./useProtocolsInChain";
import { ProtocolType } from "@metrom-xyz/chains";
import { APTOS } from "../commons/env";

interface UsePoolsParams extends HookBaseParams {
    chainId: SupportedChain;
    chainType: ChainType;
    dex?: SupportedDex;
}

type QueryKey = [string, SupportedDex | undefined, SupportedChain, ChainType];

export function usePools({
    chainId,
    chainType,
    dex,
    enabled = true,
}: UsePoolsParams): {
    loading: boolean;
    pools?: AmmPoolWithTvl[];
} {
    const availableDexes = useProtocolsInChain({
        chainId,
        type: ProtocolType.Dex,
        active: true,
    });

    const { data: pools, isPending: loading } = useQuery({
        queryKey: ["pools", dex, chainId, chainType],
        queryFn: async ({ queryKey }) => {
            const [, dex, chainId, chainType] = queryKey as QueryKey;
            if (!dex) return null;

            try {
                const pools = await METROM_API_CLIENT.fetchAmmPools({
                    // FIXME: remove mocked params
                    chainId: APTOS ? 17000 : chainId,
                    chainType: ChainType.Evm,
                    dex,
                });
                return pools;
            } catch (error) {
                console.error(
                    `Could not fetch pools for dex ${dex} in chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnMount: false,
        enabled:
            enabled &&
            !!dex &&
            !!availableDexes.find(({ slug }) => slug === dex),
    });

    return {
        loading,
        pools: pools || undefined,
    };
}

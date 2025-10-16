import type { SupportedChain } from "@metrom-xyz/contracts";
import {
    ChainType,
    SupportedAaveV3,
    type AaveV3Collateral,
} from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "./useProtocolsInChain";
import { METROM_API_CLIENT } from "../commons";

interface UseAaveV3CollateralsParams extends HookBaseParams {
    chainId: SupportedChain;
    chainType: ChainType;
    brand?: SupportedAaveV3;
    market?: string;
}

type QueryKey = [
    string,
    SupportedAaveV3 | undefined,
    string | undefined,
    SupportedChain,
    ChainType,
];

export function useAaveV3Collaterals({
    chainId,
    chainType,
    brand,
    market,
    enabled = true,
}: UseAaveV3CollateralsParams): {
    loading: boolean;
    collaterals?: AaveV3Collateral[];
} {
    const supportedBrands = useProtocolsInChain({
        chainId,
        type: ProtocolType.AaveV3,
        active: true,
    });

    const { data: collaterals, isPending: loading } = useQuery({
        queryKey: ["aave-v3-collaterals", brand, market, chainId, chainType],
        queryFn: async ({ queryKey }) => {
            const [, brand, market, chainId, chainType] = queryKey as QueryKey;
            if (!brand || !market) return null;

            try {
                const collaterals =
                    await METROM_API_CLIENT.fetchAaveV3Collaterals({
                        chainId,
                        chainType,
                        brand,
                        market,
                    });

                return collaterals.sort((a, b) =>
                    a.name.localeCompare(b.name, "en"),
                );
            } catch (error) {
                console.error(
                    `Could not fetch aave-v3 collaterals for brand ${brand} and market ${market}, in chain with id ${chainId} and type ${chainType}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnMount: false,
        enabled:
            enabled &&
            !!brand &&
            !!supportedBrands.find(({ slug }) => slug === brand),
    });

    return {
        loading,
        collaterals: collaterals || undefined,
    };
}

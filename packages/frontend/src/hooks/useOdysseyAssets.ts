import type { SupportedChain } from "@metrom-xyz/contracts";
import {
    ChainType,
    SupportedOdyssey,
    SupportedOdysseyStrategy,
    type OdysseyAsset,
} from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { METROM_API_CLIENT } from "../commons";

interface UseOdysseyAssetsParams extends HookBaseParams {
    chainId: SupportedChain;
    chainType: ChainType;
    brand?: SupportedOdyssey;
    strategy?: SupportedOdysseyStrategy;
}

type QueryKey = [
    string,
    SupportedOdyssey | undefined,
    SupportedOdysseyStrategy | undefined,
    SupportedChain,
    ChainType,
];

export function useOdysseyAssets({
    chainId,
    chainType,
    brand,
    strategy,
    enabled = true,
}: UseOdysseyAssetsParams): {
    loading: boolean;
    assets?: OdysseyAsset[];
} {
    const { data: assets, isPending: loading } = useQuery({
        queryKey: ["odyssey-assets", brand, strategy, chainId, chainType],
        queryFn: async ({ queryKey }) => {
            const [, brand, strategy, chainId, chainType] =
                queryKey as QueryKey;
            if (!brand || !strategy) return null;

            try {
                const collaterals = await METROM_API_CLIENT.fetchOdysseyAssets({
                    chainId,
                    chainType,
                    brand,
                    strategy,
                });

                return collaterals.sort((a, b) =>
                    a.name.localeCompare(b.name, "en"),
                );
            } catch (error) {
                console.error(
                    `Could not fetch odyssey assets for brand ${brand} and strategy ${strategy}, in chain with id ${chainId} and type ${chainType}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnMount: false,
        enabled: enabled && !!brand,
    });

    return {
        loading,
        assets: assets || undefined,
    };
}

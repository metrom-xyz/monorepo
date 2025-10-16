import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import {
    ChainType,
    SupportedLiquityV2,
    type LiquityV2Collateral,
} from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "./useProtocolsInChain";

interface UseLiquityV2CollateralsParams extends HookBaseParams {
    chainId: SupportedChain;
    chainType: ChainType;
    brand?: SupportedLiquityV2;
}

type QueryKey = [
    string,
    SupportedLiquityV2 | undefined,
    SupportedChain,
    ChainType,
];

export function useLiquityV2Collaterals({
    chainId,
    chainType,
    brand,
    enabled = true,
}: UseLiquityV2CollateralsParams): {
    loading: boolean;
    collaterals?: LiquityV2Collateral[];
} {
    const supportedBrands = useProtocolsInChain({
        chainId,
        type: ProtocolType.LiquityV2,
        active: true,
    });

    const { data: collaterals, isPending: loading } = useQuery({
        queryKey: ["liquity-v2-collaterals", brand, chainId, chainType],
        queryFn: async ({ queryKey }) => {
            const [, brand, chainId, chainType] = queryKey as QueryKey;
            if (!brand) return null;

            try {
                const collaterals =
                    await METROM_API_CLIENT.fetchLiquityV2Collaterals({
                        chainId,
                        chainType,
                        brand,
                    });

                return collaterals.sort((a, b) =>
                    a.name.localeCompare(b.name, "en"),
                );
            } catch (error) {
                console.error(
                    `Could not fetch liquity v2 collaterals for brand ${brand} in chain with id ${chainId}: ${error}`,
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

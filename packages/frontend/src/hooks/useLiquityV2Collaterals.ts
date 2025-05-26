import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { SupportedLiquityV2, type LiquityV2Collateral } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "./useProtocolsInChain";

interface UseLiquityV2CollateralsParams extends HookBaseParams {
    chainId: SupportedChain;
    brand?: SupportedLiquityV2;
}

type QueryKey = [string, SupportedLiquityV2 | undefined, SupportedChain];

export function useLiquityV2Collaterals({
    chainId,
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
        queryKey: ["liquity-v2-collaterals", brand, chainId],
        queryFn: async ({ queryKey }) => {
            const [, brand, chainId] = queryKey as QueryKey;
            if (!brand) return null;

            try {
                return await METROM_API_CLIENT.fetchLiquityV2Collaterals({
                    chainId: chainId as SupportedChain,
                    brand: brand as SupportedLiquityV2,
                });
            } catch (error) {
                console.error(
                    `Could not fetch liquity v2 collaterals for brand ${brand}: ${error}`,
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

import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { SupportedLiquityV2, type LiquityV2Collateral } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import { useProtocolsInChain } from "./useProtocolsInChain";
import { ProtocolType } from "../types/common";

export function useLiquityV2Collaterals(
    chainId: SupportedChain,
    brand?: SupportedLiquityV2,
): {
    loading: boolean;
    collaterals?: LiquityV2Collateral[];
} {
    const supportedBrands = useProtocolsInChain(
        chainId,
        ProtocolType.LiquityV2,
    );

    const { data: collaterals, isPending: loading } = useQuery({
        queryKey: ["liquity-v2-collaterals", brand, chainId],
        queryFn: async ({ queryKey }) => {
            const brand = queryKey[1];
            const chainId = queryKey[2];
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
            !!brand && !!supportedBrands.find(({ slug }) => slug === brand),
    });

    return {
        loading,
        collaterals: collaterals || undefined,
    };
}

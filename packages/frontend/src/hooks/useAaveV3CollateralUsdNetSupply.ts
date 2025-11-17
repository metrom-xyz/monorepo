import type { SupportedChain } from "@metrom-xyz/contracts";
import { ChainType, SupportedAaveV3 } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "./useProtocolsInChain";
import { METROM_API_CLIENT } from "../commons";
import type { Address } from "viem";

export interface UseAaveV3CollateralUsdNetSupplyParams extends HookBaseParams {
    chainId: SupportedChain;
    chainType: ChainType;
    brand?: SupportedAaveV3;
    market?: string;
    collateral?: Address;
    blacklistedCrossBorrowCollaterals?: Address[];
}

type QueryKey = [
    string,
    ChainType,
    SupportedChain,
    SupportedAaveV3 | undefined,
    string | undefined,
    Address | undefined,
    Address[] | undefined,
];

export function useAaveV3CollateralUsdNetSupply({
    chainId,
    chainType,
    brand,
    market,
    collateral,
    blacklistedCrossBorrowCollaterals,
    enabled = true,
}: UseAaveV3CollateralUsdNetSupplyParams): {
    loading: boolean;
    usdNetSupply?: number;
} {
    const supportedBrands = useProtocolsInChain({
        chainId,
        type: ProtocolType.AaveV3,
        active: true,
    });

    const { data: usdNetSupply, isLoading: loading } = useQuery({
        queryKey: [
            "aave-v3-collateral-usd-net-supply",
            chainType,
            chainId,
            brand,
            market,
            collateral,
            blacklistedCrossBorrowCollaterals,
        ],
        queryFn: async ({ queryKey }) => {
            const [
                ,
                chainType,
                chainId,
                brand,
                market,
                collateral,
                blacklistedCrossBorrowCollaterals,
            ] = queryKey as QueryKey;
            if (!brand || !market || !collateral) return null;

            try {
                const usdNetSupply =
                    await METROM_API_CLIENT.fetchAaveV3CollateralUsdNetSupply({
                        chainId,
                        chainType,
                        brand,
                        market,
                        collateral,
                        blacklistedCrossBorrowCollaterals,
                    });

                return usdNetSupply;
            } catch (error) {
                console.error(
                    `Could not fetch aave-v3 collateral usd net supply for brand ${brand} and market ${market} and collateral ${collateral}, in chain with id ${chainId} and type ${chainType}: ${error}`,
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
        usdNetSupply: usdNetSupply === 0 ? usdNetSupply : undefined,
    };
}

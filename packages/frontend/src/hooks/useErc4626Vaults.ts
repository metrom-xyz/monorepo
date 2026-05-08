import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import {
    ChainType,
    SupportedErc4626Vault,
    type Erc4626Vault,
} from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { useProtocolsInChain } from "./useProtocolsInChain";
import { ProtocolType } from "@metrom-xyz/chains";

interface UseErc4626VaultsParams extends HookBaseParams {
    chainId?: SupportedChain;
    chainType: ChainType;
    brand?: SupportedErc4626Vault;
}

type QueryKey = [
    string,
    SupportedErc4626Vault | undefined,
    SupportedChain | undefined,
    ChainType,
];

export function useErc4626Vaults({
    chainId,
    chainType,
    brand,
    enabled = true,
}: UseErc4626VaultsParams): {
    loading: boolean;
    vaults?: Erc4626Vault[];
} {
    const availableErc4626Vaults = useProtocolsInChain({
        chainId,
        type: ProtocolType.Erc4626Vault,
        active: true,
    });

    const { data: vaults, isPending: loading } = useQuery({
        queryKey: ["pools", brand, chainId, chainType],
        queryFn: async ({ queryKey }) => {
            const [, brand, chainId, chainType] = queryKey as QueryKey;
            if (!brand || !chainId) return null;

            try {
                const pools = await METROM_API_CLIENT.fetchErc4626Vaults({
                    chainId,
                    chainType,
                    brand,
                });
                return pools;
            } catch (error) {
                console.error(
                    `Could not fetch erc4626 vaults for brand ${brand} in chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnMount: false,
        enabled:
            enabled &&
            !!brand &&
            !!availableErc4626Vaults.find(({ slug }) => slug === brand),
    });

    return {
        loading,
        vaults: vaults || undefined,
    };
}

import { type Address } from "viem";
import type { HookBaseParams } from "../types/hooks";
import type { ChainType, FungibleAssetInfo } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import { useChainWithType } from "./useChainWithType";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";

interface UseFungibleAssetInfoParams extends HookBaseParams {
    address?: string;
}

interface UseFungibleAssetInfoReturnValue {
    loading: boolean;
    errored: boolean;
    info?: FungibleAssetInfo | null;
}

type QueryKey = [string, ChainType, SupportedChain, Address];

export function useFungibleAssetInfo({
    address,
    enabled,
}: UseFungibleAssetInfoParams): UseFungibleAssetInfoReturnValue {
    const { id: chainId, type: chainType } = useChainWithType();

    const {
        data: info,
        isError: errored,
        isLoading: loading,
    } = useQuery({
        queryKey: ["fungible-asset-info", chainType, chainId, address],
        queryFn: async ({ queryKey }) => {
            const [, chainType, chainId, address] = queryKey as QueryKey;
            if (!address) return null;

            try {
                return await METROM_API_CLIENT.fetchFungibleAssetInfo({
                    chainId,
                    chainType,
                    address,
                });
            } catch (error) {
                console.error(`Could not fetch fungible asset info: ${error}`);
                throw error;
            }
        },
        enabled: !!address && enabled,
    });

    return {
        info,
        errored,
        loading,
    };
}

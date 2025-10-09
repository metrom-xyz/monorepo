import { useFungibleAssetMetadata } from "@aptos-labs/react";
import { APTOS } from "../commons/env";
import { useReadContracts } from "wagmi";
import { erc20Abi, type Address } from "viem";
import { useMemo } from "react";
import type { HookBaseParams } from "../types/hooks";
import type { TokenInfo } from "../types/common";

interface UseAssetInfoParams extends HookBaseParams {
    address?: string;
}

interface UseAssetInfoReturnValue {
    loading: boolean;
    info?: TokenInfo | null;
}

export function useAssetInfo({
    address,
    enabled,
}: UseAssetInfoParams): UseAssetInfoReturnValue {
    const tokenMvm = useFungibleAssetMetadata({
        asset: address,
        enabled: !!address && APTOS && enabled,
    });
    const tokenEvm = useReadContracts({
        contracts: [
            {
                address: address as Address,
                abi: erc20Abi,
                functionName: "name",
            },
            {
                address: address as Address,
                abi: erc20Abi,
                functionName: "symbol",
            },
        ],
        query: { enabled: !!address && !APTOS && enabled },
    });

    const loading = tokenMvm.isLoading || tokenEvm.isLoading;

    const info: TokenInfo | undefined | null = useMemo(() => {
        if (loading || !address) return undefined;

        if (APTOS && tokenMvm.data === null) return null;
        if (
            !APTOS &&
            (!tokenEvm.data?.[0].result || !tokenEvm.data?.[1].result)
        )
            return null;

        if (APTOS && tokenMvm.data)
            return {
                address: tokenMvm.data.assetType as Address,
                name: tokenMvm.data.name,
                symbol: tokenMvm.data.symbol,
            };
        if (
            !APTOS &&
            tokenEvm.data &&
            tokenEvm.data[0].result &&
            tokenEvm.data[1].result
        )
            return {
                address: address as Address,
                name: tokenEvm.data[0].result,
                symbol: tokenEvm.data[1].result,
            };
    }, [address, loading, tokenEvm.data, tokenMvm.data]);

    return {
        info,
        loading,
    };
}

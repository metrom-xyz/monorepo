import { useContext } from "react";
import { TokenIconsContext } from "@/src/components/token-icon-provider";
import type { Address } from "viem";

export function useTokenIconUri(
    chainId?: number,
    address?: Address,
): {
    loading: boolean;
    uri?: string;
} {
    const { loading, icons } = useContext(TokenIconsContext);

    return {
        loading,
        uri:
            !chainId || !address || !icons
                ? undefined
                : icons[chainId]?.[address.toLowerCase() as Address],
    };
}

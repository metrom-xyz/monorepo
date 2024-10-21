import { useContext } from "react";
import { TokenIconsContext } from "@/src/components/token-icon-provider";
import type { Address } from "viem";

export function useTokenIconUris(
    chainId?: number,
    addresses?: (Address | undefined)[],
): {
    loading: boolean;
    uris?: Record<Address, string>;
} {
    const { loading, icons } = useContext(TokenIconsContext);

    const uris: Record<Address, string> = {};
    if (chainId && addresses && addresses.length > 0 && icons) {
        for (const address of addresses) {
            if (!address) continue;
            uris[address] = icons[chainId]?.[address.toLowerCase() as Address];
        }
    }

    return {
        loading,
        uris,
    };
}

import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { CHAIN_DATA } from "../commons";
import type { AmmInfo } from "../types";

export function useAvailableAmms(): AmmInfo[] {
    const chainId: SupportedChain = useChainId();

    return CHAIN_DATA[chainId].amms.map((amm) => ({
        slug: amm.slug,
        name: amm.name,
        logo: amm.logo,
    }));
}

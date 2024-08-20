import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { CHAIN_DATA } from "../commons";
import type { AmmPayload } from "../types";

export function useAvailableAmms(): AmmPayload[] {
    const chainId: SupportedChain = useChainId();

    return CHAIN_DATA[chainId].amms.map((amm) => ({
        slug: amm.slug,
        name: amm.name,
        logo: amm.logo,
    }));
}

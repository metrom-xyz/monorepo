import type { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_DATA } from "../commons";
import type { Amm } from "../types";
import { useChainId } from "wagmi";

export function useAvailableAmms(): Pick<Amm, "slug" | "name" | "logo">[] {
    const chainId: SupportedChain = useChainId();

    return CHAIN_DATA[chainId].amms.map((amm) => ({
        slug: amm.slug,
        name: amm.name,
        logo: amm.logo,
    }));
}

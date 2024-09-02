import { CHAIN_DATA } from "../commons";
import type { AmmInfo } from "../types";

export function useAmms(): AmmInfo[] {
    return Object.values(CHAIN_DATA).flatMap((chainData) => {
        return chainData.amms.map((amm) => ({
            slug: amm.slug,
            name: amm.name,
            logo: amm.logo,
        }));
    });
}

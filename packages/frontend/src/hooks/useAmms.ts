import { SUPPORTED_AMMS_BY_CHAIN } from "../commons";
import type { AmmInfo } from "../types";

export function useAmms(): AmmInfo[] {
    return Object.values(SUPPORTED_AMMS_BY_CHAIN).flatMap((amms) => {
        return amms.map((amm) => ({
            slug: amm.slug,
            name: amm.name,
            logo: amm.logo,
        }));
    });
}

import { startTransition, useCallback } from "react";
import type { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "../context/chain-type";
import { usePathname, useRouter } from "../i18n/routing";

export function useSwitchEcosystem() {
    const { setChainType } = useChainType();
    const pathname = usePathname();
    const router = useRouter();

    return useCallback(
        (type: ChainType) => {
            if (pathname.startsWith("/campaigns/create")) {
                router.replace("/campaigns/create");
                startTransition(() => setChainType(type));
            } else {
                setChainType(type);
            }
        },
        [setChainType, pathname, router],
    );
}

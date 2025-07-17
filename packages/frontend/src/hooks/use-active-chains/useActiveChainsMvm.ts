import type { HookBaseParams } from "@/src/types/hooks";
import { useMemo } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { ENVIRONMENT } from "@/src/commons/env";
import { Environment } from "@metrom-xyz/sdk";
import { APTOS_NETWORK_ID } from "@/src/utils/chain";

export function useActiveChainsMvm({ enabled = true }: HookBaseParams = {}) {
    return useMemo(() => {
        if (!enabled) return [];

        return ENVIRONMENT === Environment.Production
            ? [APTOS_NETWORK_ID[Network.MAINNET]]
            : [
                  APTOS_NETWORK_ID[Network.DEVNET],
                  APTOS_NETWORK_ID[Network.TESTNET],
              ];
    }, [enabled]);
}

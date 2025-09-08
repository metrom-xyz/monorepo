import type { SupportedChain as SupportedChainMvm } from "@metrom-xyz/aptos-contracts";
import type { SupportedChain as SupportedChainEvm } from "@metrom-xyz/contracts";
import type { ChainType } from "@metrom-xyz/sdk";

export interface ChainWithType {
    id: number;
    type: ChainType;
}

export type SupportedCrossVmChain = SupportedChainEvm | SupportedChainMvm;

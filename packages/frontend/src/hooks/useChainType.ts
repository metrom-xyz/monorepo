import { ChainType } from "@metrom-xyz/sdk";
import { APTOS } from "../commons/env";

export function useChainType() {
    return APTOS ? ChainType.Aptos : ChainType.Evm;
}

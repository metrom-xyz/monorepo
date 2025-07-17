import { useChainId as useChainIdWagmi } from "wagmi";
import { useChainIdMvm } from "./useChainIdMvm";
import { APTOS } from "@/src/commons/env";

export function useChainId() {
    const chainIdEvm = useChainIdWagmi();
    const chainIdMvm = useChainIdMvm();

    if (APTOS) return chainIdMvm;
    return chainIdEvm;
}

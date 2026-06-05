import { NetworkSelectMvm } from "./network-select-mvm";
import { NetworkSelectEvm } from "./network-select-evm";
import { useChainType } from "@/src/hooks/useChainType";
import { ChainType } from "@metrom-xyz/sdk";

export function NetworkSelect() {
    const chainType = useChainType();

    switch (chainType) {
        case ChainType.Evm:
            return <NetworkSelectEvm />;
        case ChainType.Aptos:
            return <NetworkSelectMvm />;
        case ChainType.Svm:
            return null;
        default:
            return null;
    }
}

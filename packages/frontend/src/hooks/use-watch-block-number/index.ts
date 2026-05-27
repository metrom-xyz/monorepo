import type { HookBaseParams } from "@/src/types/hooks";
import { useWatchBlockNumberEvm } from "./useWatchBlockNumberEvm";
import { useWatchBlockNumberMvm } from "./useWatchBlockNumberMvm";
import { useChainType } from "../useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useWatchBlockNumberSvm } from "./useWatchBlockNumberSvm";

export function useWatchBlockNumber(params: HookBaseParams = {}) {
    const chainType = useChainType();

    const blockNumberEvm = useWatchBlockNumberEvm({
        ...params,
        enabled: chainType === ChainType.Evm,
    });
    const blockNumberMvm = useWatchBlockNumberMvm({
        ...params,
        enabled: chainType === ChainType.Aptos,
    });
    const blockNumberSvm = useWatchBlockNumberSvm({
        ...params,
        enabled: chainType === ChainType.Svm,
    });

    switch (chainType) {
        case ChainType.Evm:
            return blockNumberEvm;
        case ChainType.Aptos:
            return blockNumberMvm;
        case ChainType.Svm:
            return blockNumberSvm;
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useWatchBlockNumber`,
            );
    }
}

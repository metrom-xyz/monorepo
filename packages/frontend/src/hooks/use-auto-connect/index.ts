import { useCallback } from "react";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "../../context/chain-type";
import { useAutoConnectEvm } from "./useAutoConnectEvm";
import { useAutoConnectMvm } from "./useAutoConnectMvm";
import { useAutoConnectSvm } from "./useAutoConnectSvm";
import { useAutoConnectSui } from "./useAutoConnectSui";

export function useAutoConnect() {
    const { setAutoConnecting } = useChainType();
    const attemptEvm = useAutoConnectEvm();
    const attemptMvm = useAutoConnectMvm();
    const attemptSvm = useAutoConnectSvm();
    const attemptSui = useAutoConnectSui();

    return useCallback(
        async (chainType: ChainType) => {
            try {
                switch (chainType) {
                    case ChainType.Evm:
                        return await attemptEvm();
                    case ChainType.Aptos:
                        return await attemptMvm();
                    case ChainType.Svm:
                        return await attemptSvm();
                    case ChainType.Sui:
                        return await attemptSui();
                    default:
                        throw new Error(
                            `Unsupported chain type ${chainType} in useAutoConnect`,
                        );
                }
            } finally {
                setAutoConnecting(false);
            }
        },
        [attemptEvm, attemptMvm, attemptSvm, attemptSui, setAutoConnecting],
    );
}

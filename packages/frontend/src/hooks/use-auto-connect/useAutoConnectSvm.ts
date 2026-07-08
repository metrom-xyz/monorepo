import { useCallback, useEffect } from "react";
import { useWalletConnection } from "@solana/react-hooks";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "../../context/chain-type";

export function useAutoConnectSvm() {
    const { connectors, connected, connect, connectorId } =
        useWalletConnection();
    const { getLastWallet, setLastWallet, clearLastWallet } = useChainType();

    useEffect(() => {
        if (connected && connectorId) setLastWallet(ChainType.Svm, connectorId);
    }, [connected, connectorId, setLastWallet]);

    return useCallback(async () => {
        if (connected) return;

        const id = getLastWallet(ChainType.Svm);
        if (!id) return;

        const connector = connectors.find(
            (connector) => connector.id === id && connector.isSupported(),
        );
        if (!connector) return;

        try {
            await connect(id, {
                autoConnect: true,
                allowInteractiveFallback: false,
            });
        } catch (error) {
            console.warn(`Could not auto-connect Solana wallet: ${error}`);
            clearLastWallet(ChainType.Svm);
        }
    }, [connected, connect, connectors, getLastWallet, clearLastWallet]);
}

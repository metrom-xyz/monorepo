import { useCallback, useEffect } from "react";
import { isInstallRequired, useWallet } from "@aptos-labs/wallet-adapter-react";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "../../context/chain-type";

export function useAutoConnectMvm() {
    const { wallets = [], connected, connect, wallet } = useWallet();
    const { getLastWallet, setLastWallet, clearLastWallet } = useChainType();

    useEffect(() => {
        if (connected && wallet?.name)
            setLastWallet(ChainType.Aptos, wallet.name);
    }, [connected, wallet?.name, setLastWallet]);

    return useCallback(async () => {
        if (connected) return;

        const name = getLastWallet(ChainType.Aptos);
        if (!name) return;

        const target = wallets.find((wallet) => wallet.name === name);
        if (!target || isInstallRequired(target)) return;

        try {
            connect(name);
        } catch (error) {
            console.warn(`Could not auto-connect Aptos wallet: ${error}`);
            clearLastWallet(ChainType.Aptos);
        }
    }, [connected, connect, wallets, getLastWallet, clearLastWallet]);
}

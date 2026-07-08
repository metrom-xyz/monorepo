import { useCallback, useEffect } from "react";
import {
    useCurrentAccount,
    useCurrentWallet,
    useDAppKit,
    useWallets,
} from "@mysten/dapp-kit-react";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "../../context/chain-type";

export function useAutoConnectSui() {
    const dAppKit = useDAppKit();
    const wallets = useWallets();
    const account = useCurrentAccount();
    const wallet = useCurrentWallet();
    const { getLastWallet, setLastWallet, clearLastWallet } = useChainType();

    useEffect(() => {
        if (account && wallet?.name) setLastWallet(ChainType.Sui, wallet.name);
    }, [account, wallet?.name, setLastWallet]);

    return useCallback(async () => {
        if (account) return;

        const name = getLastWallet(ChainType.Sui);
        if (!name) return;

        const target = wallets.find((wallet) => wallet.name === name);
        if (!target) return;

        try {
            await dAppKit.connectWallet({ wallet: target });
        } catch (error) {
            console.warn(`Could not auto-connect Sui wallet: ${error}`);
            clearLastWallet(ChainType.Sui);
        }
    }, [account, dAppKit, wallets, getLastWallet, clearLastWallet]);
}

import { useCallback, useEffect } from "react";
import { useAccount, useConfig } from "wagmi";
import { connect } from "@wagmi/core";
import { ChainType } from "@metrom-xyz/sdk";
import { SAFE } from "../../commons/env";
import { useChainType } from "../../context/chain-type";

export function useAutoConnectEvm() {
    const config = useConfig();
    const { isConnected, connector } = useAccount();
    const { getLastWallet, setLastWallet, clearLastWallet } = useChainType();

    useEffect(() => {
        if (SAFE) return;
        if (isConnected && connector?.id)
            setLastWallet(ChainType.Evm, connector.id);
    }, [isConnected, connector?.id, setLastWallet]);

    return useCallback(async () => {
        // The Safe connector has its own dedicated auto-connect flow
        if (SAFE || config.state.status === "connected") return;

        const id = getLastWallet(ChainType.Evm);
        if (!id) return;

        const connector = config.connectors.find(
            (connector) => connector.id === id,
        );
        if (!connector) return;

        try {
            const accounts = await connector.getAccounts().catch(() => []);
            if (!accounts.length) return;

            await connect(config, { connector });
        } catch (error) {
            console.warn(`Could not auto-connect EVM wallet: ${error}`);
            clearLastWallet(ChainType.Evm);
        }
    }, [config, getLastWallet, clearLastWallet]);
}

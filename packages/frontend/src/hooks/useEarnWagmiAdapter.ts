import {
    useAppKit,
    useAppKitAccount,
    useAppKitNetwork,
} from "@reown/appkit/react";
import type { Adapter, Transaction } from "@turtleclub/earn-widget";
import {
    disconnect,
    sendTransaction,
    signMessage,
    switchChain,
} from "@wagmi/core";
import { useConfig } from "wagmi";

export function useEarnWagmiAdapter(): Adapter {
    const config = useConfig();
    const { open } = useAppKit();
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();

    return {
        user: address,
        network: chainId ? Number(chainId) : undefined,

        openConnectionModal: () => {
            open();
        },

        signMessage: async (message: string) => {
            return await signMessage(config, { message });
        },

        sendTransaction: async (tx: Transaction) => {
            return await sendTransaction(config, tx);
        },

        changeNetwork: async (chainId: number) => {
            await switchChain(config, { chainId });
        },

        disconnect: async () => {
            await disconnect(config);
        },
    };
}

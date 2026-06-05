import type { PropsWithChildren } from "react";
import { AptosJSCoreProvider } from "@aptos-labs/react";
import { useWalletAdapterCore } from "@aptos-labs/react/connectors";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import {
    APTOS_CLIENT_API_KEY,
    APTOS_CLIENT_TESTNET_API_KEY,
} from "../commons/env";

export default function AptosCoreProvider({ children }: PropsWithChildren) {
    const wallet = useWallet();

    const core = useWalletAdapterCore({
        // FIXME: fix type issue
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wallet: wallet as any,
        config: {
            apiKey: {
                [Network.MAINNET]: APTOS_CLIENT_API_KEY,
                [Network.TESTNET]: APTOS_CLIENT_TESTNET_API_KEY,
            },
        },
    });

    return <AptosJSCoreProvider core={core}>{children}</AptosJSCoreProvider>;
}

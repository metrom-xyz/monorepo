import type { PropsWithChildren } from "react";
import { AptosJSCoreProvider } from "@aptos-labs/react";
import { useWalletAdapterCore } from "@aptos-labs/react/connectors";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { type NetworkInfo } from "@aptos-labs/js-pro";
import { ENVIRONMENT } from "../commons/env";
import { Environment } from "@metrom-xyz/sdk";
import { Network } from "@aptos-labs/ts-sdk";

export default function AptosCoreProvider({ children }: PropsWithChildren) {
    const wallet = useWallet();
    const defaultNetwork: NetworkInfo = {
        network:
            ENVIRONMENT === Environment.Production
                ? Network.MAINNET
                : Network.TESTNET,
    };
    const core = useWalletAdapterCore({ wallet, defaultNetwork });
    return <AptosJSCoreProvider core={core}>{children}</AptosJSCoreProvider>;
}

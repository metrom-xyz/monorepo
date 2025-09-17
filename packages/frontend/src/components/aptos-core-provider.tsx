import type { PropsWithChildren } from "react";
import { AptosJSCoreProvider } from "@aptos-labs/react";
import { useWalletAdapterCore } from "@aptos-labs/react/connectors";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { APTOS_CLIENT_API_KEY, ENVIRONMENT } from "../commons/env";
import { Environment } from "@metrom-xyz/sdk";

export default function AptosCoreProvider({ children }: PropsWithChildren) {
    const wallet = useWallet();
    const core = useWalletAdapterCore({
        // TODO: fix type issue
        wallet: wallet as any,
        defaultNetwork:
            ENVIRONMENT === Environment.Production
                ? { network: Network.MAINNET }
                : { network: Network.TESTNET },
        config: { apiKey: APTOS_CLIENT_API_KEY },
    });
    return <AptosJSCoreProvider core={core}>{children}</AptosJSCoreProvider>;
}

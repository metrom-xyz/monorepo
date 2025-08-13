import type { PropsWithChildren } from "react";
import { AptosJSCoreProvider } from "@aptos-labs/react";
import { useWalletAdapterCore } from "@aptos-labs/react/connectors";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { APTOS_CLIENT_API_KEY } from "../commons/env";

export default function AptosCoreProvider({ children }: PropsWithChildren) {
    const wallet = useWallet();
    const core = useWalletAdapterCore({
        wallet,
        config: { apiKey: APTOS_CLIENT_API_KEY },
    });
    return <AptosJSCoreProvider core={core}>{children}</AptosJSCoreProvider>;
}

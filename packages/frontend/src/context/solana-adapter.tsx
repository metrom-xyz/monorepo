import { autoDiscover, createClient, filterByNames } from "@solana/client";
import { SolanaProvider } from "@solana/react-hooks";
import type { ReactNode } from "react";
import { ENVIRONMENT } from "../commons/env";
import { Environment } from "@metrom-xyz/sdk";

export const SOLANA_WALLET_CONNECTORS: {
    id: string;
    name: string;
    icon?: string;
    homepage: string;
}[] = [
    {
        id: "wallet-standard:phantom",
        name: "Phantom",
        homepage: "https://phantom.com/",
    },
    {
        id: "wallet-standard:solflare",
        name: "Solflare",
        homepage: "https://www.solflare.com/",
    },
    {
        id: "wallet-standard:metamask",
        name: "MetaMask",
        homepage: "https://metamask.io/",
    },
    {
        id: "wallet-standard:brave-wallet",
        name: "Brave Wallet",
        homepage: "https://brave.com/wallet/",
    },
    {
        id: "wallet-standard:walletconnect",
        name: "WalletConnect",
        homepage: "https://walletconnect.com/",
    },
];

const client = createClient({
    cluster: ENVIRONMENT === Environment.Production ? "mainnet" : "devnet",
    walletConnectors: autoDiscover({
        filter: filterByNames(
            ...SOLANA_WALLET_CONNECTORS.map((connector) => connector.name),
        ),
    }),
});

export function SolanaAdapterContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    return <SolanaProvider client={client}>{children}</SolanaProvider>;
}

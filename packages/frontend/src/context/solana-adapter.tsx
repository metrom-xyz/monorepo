import { autoDiscover, createClient, filterByNames } from "@solana/client";
import { SolanaProvider } from "@solana/react-hooks";
import type { ReactNode } from "react";
import { ENVIRONMENT } from "../commons/env";
import { Environment } from "@metrom-xyz/sdk";

export const SOLANA_WALLET_CONNECTORS_NAMES = [
    "phantom",
    "solflare",
    "metamask",
    "brave",
    "walletconnect",
];

const client = createClient({
    cluster: ENVIRONMENT === Environment.Production ? "mainnet" : "devnet",
    walletConnectors: autoDiscover({
        filter: filterByNames(...SOLANA_WALLET_CONNECTORS_NAMES),
    }),
});

export function SolanaAdapterContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    return <SolanaProvider client={client}>{children}</SolanaProvider>;
}

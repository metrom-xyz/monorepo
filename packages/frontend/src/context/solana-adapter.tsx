import { autoDiscover, createClient, filterByNames } from "@solana/client";
import { SolanaProvider } from "@solana/react-hooks";
import type { ReactNode } from "react";
import { ENVIRONMENT } from "../commons/env";
import { Environment } from "@metrom-xyz/sdk";

const client = createClient({
    cluster: ENVIRONMENT === Environment.Production ? "mainnet" : "testnet",
    walletConnectors: autoDiscover({
        filter: filterByNames("phantom", "solflare", "metamask", "brave"),
    }),
});

export function SolanaAdapterContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    return <SolanaProvider client={client}>{children}</SolanaProvider>;
}

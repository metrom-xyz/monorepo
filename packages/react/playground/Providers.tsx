import type { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
    arbitrum,
    base,
    baseSepolia,
    gnosis,
    mainnet,
    scroll,
    sepolia,
    sonic,
} from "wagmi/chains";
import { hashFn } from "wagmi/query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Environment, MetromProvider } from "@metrom-xyz/react";

const wagmiConfig = createConfig({
    chains: [
        mainnet,
        base,
        arbitrum,
        gnosis,
        scroll,
        sonic,
        sepolia,
        baseSepolia,
    ],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
        [gnosis.id]: http(),
        [scroll.id]: http(),
        [sonic.id]: http(),
        [sepolia.id]: http(),
        [baseSepolia.id]: http(),
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Campaign and claim query keys can contain BigInt values
            queryKeyHashFn: hashFn,
        },
    },
});

export function Providers({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <MetromProvider environment={Environment.Development}>
                    {children}
                </MetromProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

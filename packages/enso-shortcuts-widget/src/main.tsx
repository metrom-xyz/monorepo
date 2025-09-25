import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    gnosis,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { App } from "./app";

import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

const RAINBOWKIT_PROJECT_ID = import.meta.env.VITE_RAINBOWKIT_PROJECT_ID ?? "";

const config = getDefaultConfig({
    appName: "My RainbowKit App",
    projectId: RAINBOWKIT_PROJECT_ID,
    chains: [mainnet, polygon, optimism, arbitrum, base, gnosis],
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <App />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </StrictMode>,
);

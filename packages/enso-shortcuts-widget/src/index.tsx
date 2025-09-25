import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./index.css";

import { useEffect } from "react";
import { useStore } from "./store";
import { setApiKey } from "./util/enso";
import { TxTracker } from "./util/useTracker";
import { Card, Toaster } from "@metrom-xyz/ui";
import { WidgetComponentProps } from "./types";
import { Address } from "viem";
import SwapWidget from "./components/SwapWidget";

type WidgetProps = WidgetComponentProps & {
    apiKey: string;
    chainId?: number;
    outChainId?: number;
    outProject?: string;
};

const Widget = ({
    referralCode,
    apiKey,
    tokenOut,
    tokenIn,
    chainId,
    outChainId,
    enableShare,
    obligateSelection,
    indicateRoute,
    rotateObligated,
    outProject,
    outProjects,
    inProjects,
    outTokens,
    inTokens,
    onSuccess,
    onConnectWallet,
}: WidgetProps) => {
    const setObligatedChainId = useStore((state) => state.setObligatedChainId);
    const setTokenOutChainId = useStore((state) => state.setTokenOutChainId);

    // Initialize chain IDs on mount and when they change in props
    useEffect(() => {
        if (chainId) {
            setObligatedChainId(chainId);
        }
    }, [chainId, setObligatedChainId]);

    useEffect(() => {
        if (outChainId) {
            setTokenOutChainId(outChainId);
        }
    }, [outChainId, setTokenOutChainId]);

    // initialize client with key before it is used
    useEffect(() => {
        if (apiKey) setApiKey(apiKey);
        else alert("Provide Enso API key to the widget");
    }, []);

    return (
        <Card className="max-w-[31.25rem]">
            <Toaster richColors />
            <TxTracker />
            <SwapWidget
                referralCode={referralCode}
                outProject={outProject}
                rotateObligated={rotateObligated}
                indicateRoute={indicateRoute}
                obligateSelection={obligateSelection}
                tokenIn={tokenIn?.toLowerCase() as Address}
                tokenOut={tokenOut?.toLowerCase() as Address}
                enableShare={enableShare}
                outProjects={outProjects}
                inProjects={inProjects}
                outTokens={outTokens}
                inTokens={inTokens}
                onSuccess={onSuccess}
                onConnectWallet={onConnectWallet}
            />
        </Card>
    );
};

export { Widget };

"use client";

import { useEffect, type ReactNode } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { toast } from "sonner";
import { ConnectedNotification } from "./connected-notification";
import { SAFE_CONNECTOR_ID } from "@/src/commons";

interface SafeProviderProps {
    children: ReactNode;
}

export function SafeProvider({ children }: SafeProviderProps) {
    const { connectors, connect } = useConnect();
    const { connector } = useAccount();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        const safeConnector = connectors.find(
            (connector) => connector.id === SAFE_CONNECTOR_ID,
        );

        if (!safeConnector) return;

        if (connector?.id !== SAFE_CONNECTOR_ID) disconnect();

        connect(
            { connector: safeConnector },
            {
                onSuccess: () =>
                    toast.custom((toastId) => (
                        <ConnectedNotification toastId={toastId} />
                    )),
                onError: (error) => {
                    console.warn(
                        `Could not connect with Safe connector: ${error}`,
                    );
                },
            },
        );
    }, [connectors, connect, connector?.id, disconnect]);

    return children;
}

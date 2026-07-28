"use client";

import { useEffect } from "react";
import { useConnection, useConnect, useConnectors, useDisconnect } from "wagmi";
import { toast } from "sonner";
import { SAFE } from "../commons/env";
import { SAFE_CONNECTOR_ID } from "../commons";
import { SafeConnectedNotification } from "../components/connect-button/evm/safe-connected-notification";

export function useSafeAutoConnect() {
    const connectors = useConnectors();
    const { connector } = useConnection();
    const connect = useConnect();
    const disconnect = useDisconnect();

    useEffect(() => {
        if (!SAFE) return;

        const safeConnector = connectors.find(
            (connector) => connector.id === SAFE_CONNECTOR_ID,
        );
        if (!safeConnector) return;

        if (connector?.id !== SAFE_CONNECTOR_ID) disconnect.mutate();

        connect.mutate(
            { connector: safeConnector },
            {
                onSuccess: () =>
                    toast.custom((toastId) => (
                        <SafeConnectedNotification toastId={toastId} />
                    )),
                onError: (error) => {
                    console.warn(
                        `Could not connect with Safe connector: ${error}`,
                    );
                },
            },
        );
    }, [connect, connector?.id, connectors, disconnect]);
}

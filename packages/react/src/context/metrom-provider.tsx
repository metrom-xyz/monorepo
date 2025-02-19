import {
    Environment,
    MetromApiClient,
    metromDevelopmentApiClient,
    metromProductionApiClient,
} from "@metrom-xyz/sdk";
import { PropsWithChildren } from "react";
import { MetromContext } from "./metrom-context";

const METROM_CLIENTS: Record<Environment, MetromApiClient> = {
    [Environment.Development]: metromDevelopmentApiClient,
    [Environment.Production]: metromProductionApiClient,
};

interface MetromProviderProps {
    environment?: Environment;
}

export function MetromProvider({
    environment = Environment.Production,
    children,
}: PropsWithChildren<MetromProviderProps>) {
    return (
        <MetromContext.Provider value={{ client: METROM_CLIENTS[environment] }}>
            {children}
        </MetromContext.Provider>
    );
}

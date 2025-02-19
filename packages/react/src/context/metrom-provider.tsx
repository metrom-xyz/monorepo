import {
    Environment,
    MetromApiClient,
    metromDevelopmentApiClient,
    metromProductionApiClient,
} from "@metrom-xyz/sdk";
import { createContext, PropsWithChildren } from "react";

const METROM_CLIENTS: Record<Environment, MetromApiClient> = {
    [Environment.Development]: metromDevelopmentApiClient,
    [Environment.Production]: metromProductionApiClient,
};

export const MetromContext = createContext<
    { client: MetromApiClient } | undefined
>(undefined);

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

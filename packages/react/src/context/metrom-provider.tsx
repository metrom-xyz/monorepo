import { Environment, METROM_API_CLIENT } from "@metrom-xyz/sdk";
import { PropsWithChildren } from "react";
import { MetromContext } from "./metrom-context";

interface MetromProviderProps {
    environment?: Environment;
}

export function MetromProvider({
    environment = Environment.Development,
    children,
}: PropsWithChildren<MetromProviderProps>) {
    return (
        <MetromContext.Provider
            value={{ client: METROM_API_CLIENT[environment] }}
        >
            {children}
        </MetromContext.Provider>
    );
}

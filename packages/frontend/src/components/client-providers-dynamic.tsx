"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ClientProviders = dynamic(
    () =>
        import("./client-providers").then((module) => ({
            default: module.ClientProviders,
        })),
    { ssr: false },
);

export function ClientProvidersDynamic({ children }: { children: ReactNode }) {
    return <ClientProviders>{children}</ClientProviders>;
}

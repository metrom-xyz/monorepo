"use client";

import { type ReactNode } from "react";
import { TokenIconsProvider } from "./token-icon-provider";
import { Toaster } from "@metrom-xyz/ui";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import Fathom from "./fathom";
import { ReownAppKitContextProvider } from "../context/reown-app-kit";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export function ClientProviders({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <ReownAppKitContextProvider>
            <TokenIconsProvider>
                <Fathom />
                <Toaster />
                {children}
            </TokenIconsProvider>
        </ReownAppKitContextProvider>
    );
}

import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

import type { Metadata } from "next";
import { type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Locale } from "@rainbow-me/rainbowkit";
import { ClientProviders } from "../../components/client-providers";
import Fathom from "@/src/components/fathom";

import styles from "./styles.module.css";

export const metadata: Metadata = {
    title: "Metrom",
    description: "Design your incentives to AMMplify liquidity.",
};

export default async function Layout({
    children,
    params: { locale },
}: Readonly<{
    children: ReactNode;
    params: { locale: string };
}>) {
    const messages = await getMessages();

    return (
        <html lang={locale} className={styles.root}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <ClientProviders locale={locale as Locale}>
                        <Fathom />
                        {children}
                    </ClientProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

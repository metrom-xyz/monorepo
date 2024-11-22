import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@metrom-xyz/ui/style.css";
import "./globals.css";

import type { Metadata } from "next";
import { type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import type { Locale } from "@rainbow-me/rainbowkit";
import { ClientProviders } from "../../components/client-providers";
import Fathom from "@/src/components/fathom";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import classNames from "classnames";
import { Nav } from "@/src/components/layout/nav";
import { Footer } from "@/src/components/layout/footer";

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
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    unstable_setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale} className={styles.root}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <ClientProviders locale={locale as Locale}>
                        <Fathom />
                        <div className={classNames(styles.root, styles.layout)}>
                            <Nav />
                            <div className={styles.main}>{children}</div>
                            <Footer />
                        </div>
                    </ClientProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

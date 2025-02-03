import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../../app.css";

import type { Metadata } from "next";
import { type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rainbow-me/rainbowkit";
import { ClientProviders } from "../../components/client-providers";
import Fathom from "@/src/components/fathom";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import classNames from "classnames";
import { Nav } from "@/src/components/layout/nav";
import { Footer } from "@/src/components/layout/footer";

import styles from "./styles.module.css";

interface Params {
    locale: string;
}

interface LayoutParams {
    children: ReactNode;
    params: Promise<Params>;
}

export const metadata: Metadata = {
    title: "Metrom",
    description: "Design your incentives to AMMplify liquidity.",
};

export default async function Layout({ children, params }: LayoutParams) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale} className="dark">
            <body>
                <div className={styles.root}>
                    <NextIntlClientProvider messages={messages}>
                        <ClientProviders locale={locale as Locale}>
                            <Fathom />
                            <div
                                className={classNames(
                                    styles.root,
                                    styles.layout,
                                )}
                            >
                                <Nav />
                                <div className={styles.main}>{children}</div>
                                <Footer />
                            </div>
                        </ClientProviders>
                    </NextIntlClientProvider>
                </div>
            </body>
        </html>
    );
}

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

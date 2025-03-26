import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../../app.css";

import type { Metadata } from "next";
import { type ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Locale as RainbowLocale } from "@rainbow-me/rainbowkit";
import { ClientProviders } from "../../components/client-providers";
import { routing, type Locale } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { Layout as AppLayout } from "../../components/layout";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { BASE_URL } from "@/src/commons";

interface Params {
    locale: Locale;
}

interface LayoutParams {
    children: ReactNode;
    params: Promise<Params>;
}

export const metadata: Metadata = {
    title: "Maximize your liquidity mining impact with precise incentives",
    description:
        "Metrom is a flexible liquidity mining platform designed to help AMMs and projects efficiently launch and manage multiple incentivisation campaigns.",
    alternates: {
        canonical: `${BASE_URL}/en`,
        languages: {
            en: `${BASE_URL}/en`,
        },
    },
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
    keywords: [
        "kpi",
        "metrom",
        "precise",
        "incentives",
        "incentivisation",
        "amm",
        "liquidity",
        "mining",
        "efficiency",
    ],
};

export default async function Layout({ children, params }: LayoutParams) {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <NextIntlClientProvider>
                    <ThemeProvider attribute={"data-theme"}>
                        <ClientProviders locale={locale as RainbowLocale}>
                            <AppLayout>{children}</AppLayout>
                        </ClientProviders>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

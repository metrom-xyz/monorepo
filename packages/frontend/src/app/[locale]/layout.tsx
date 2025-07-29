import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../../app.css";

import type { Metadata } from "next";
import { type ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
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
    title: "Distribute incentives based on outcomes",
    description:
        "Metrom helps protocols to create and launch their campaigns, while incentives get distributed based on the outcomes set through KPIs.",
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
                        <ClientProviders>
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

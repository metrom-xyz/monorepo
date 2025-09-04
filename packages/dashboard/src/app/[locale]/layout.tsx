import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../../app.css";

import type { Metadata } from "next";
import { Locale, routing } from "@/i18n/routing";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Layout } from "@/components/layout";
import { ClientProviders } from "@/components/client-providers";

export const metadata: Metadata = {
    title: "Maximize your liquidity mining impact with precise incentives",
    description:
        "Metrom is a flexible liquidity mining platform designed to help AMMs and projects efficiently launch and manage multiple incentivisation campaigns.",
};

interface Params {
    locale: string;
}

interface LayoutParams {
    children: ReactNode;
    params: Promise<Params>;
}

export default async function RootLayout({ children, params }: LayoutParams) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as Locale)) notFound();

    setRequestLocale(locale as Locale);

    return (
        <html lang={locale} suppressHydrationWarning className="theme-bg">
            <body>
                <NextIntlClientProvider>
                    <ThemeProvider attribute={"data-theme"}>
                        <ClientProviders>
                            <Layout>{children}</Layout>
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

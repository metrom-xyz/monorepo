import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../../app.css";

import type { Metadata } from "next";
import { type ReactNode } from "react";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rainbow-me/rainbowkit";
import { ClientProviders } from "../../components/client-providers";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { Layout as AppLayout } from "../../components/layout";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

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
        <html lang={locale} suppressHydrationWarning>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider attribute={"data-theme"}>
                        <ClientProviders locale={locale as Locale}>
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

import "./globals.css";

import type { Metadata } from "next";
import { NextUIProvider } from "@nextui-org/react";
import { type ReactNode } from "react";
import { Nav } from "@/src/components/nav";
import { ClientProviders } from "@/src/components/client-providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
    title: "Metrom",
    description: "Design your incentives to AMMplify liquidity.",
};

export default async function RootLayout({
    children,
    params: { locale },
}: Readonly<{
    children: ReactNode;
    params: { locale: string };
}>) {
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <NextUIProvider>
                        <ClientProviders>
                            <div className="h-screen w-screen bg-zinc-50 flex flex-col items-center">
                                <Nav />
                                {children}
                            </div>
                        </ClientProviders>
                    </NextUIProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

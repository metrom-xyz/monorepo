import "./globals.css";

import type { Metadata } from "next";
import { NextUIProvider } from "@nextui-org/react";
import { type ReactNode } from "react";
import { Nav } from "@/components/nav";
import { ClientProviders } from "@/components/client-providers";

export const metadata: Metadata = {
    title: "Metrom",
    description: "Design your incentives to AMMplify liquidity.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <NextUIProvider>
                    <ClientProviders>
                        <div className="h-screen w-screen bg-zinc-50 flex flex-col items-center ">
                            <Nav />
                            {children}
                        </div>
                    </ClientProviders>
                </NextUIProvider>
            </body>
        </html>
    );
}

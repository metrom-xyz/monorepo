"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { MetromLogo } from "@/components/assets/metrom-logo";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Nav() {
    return (
        <div className="relative h-20 w-full max-w-screen-2xl flex justify-between items-center">
            <MetromLogo className="h-8 w-36" />
            <Tabs size="lg" className="absolute left-1/2 -translate-x-1/2">
                <Tab title="Photos" />
                <Tab title="Music" />
                <Tab title="Videos" />
            </Tabs>
            <ConnectButton />
        </div>
    );
}

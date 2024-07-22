"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MetromLogo } from "./assets/metrom-logo";
import { usePathname, useRouter } from "../navigation";
import { useTranslations } from "next-intl";

export function Nav() {
    const t = useTranslations("navigation");
    const router = useRouter();
    const path = usePathname();

    function handleOnNavigation(key: React.Key) {
        router.push(key.toString());
    }

    return (
        <div className="relative h-20 w-full max-w-screen-2xl flex justify-between items-center">
            <MetromLogo className="h-8 w-36 text-white" />
            <Tabs
                selectedKey={path}
                onSelectionChange={handleOnNavigation}
                size="lg"
                className="absolute left-1/2 -translate-x-1/2"
            >
                <Tab key={"/"} title={t("all_campaigns")} />
                <Tab key={"/campaigns/create"} title={t("new_campaign")} />
            </Tabs>
            <ConnectButton />
        </div>
    );
}

"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter } from "@/src/navigation";
import { MetromLogo } from "../assets/metrom-logo";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";

export function Nav() {
    const t = useTranslations("navigation");
    const router = useRouter();
    const path = usePathname();

    function handleOnNavigation(key: React.Key) {
        router.push(key.toString());
    }

    return (
        <div className={styles.root}>
            <MetromLogo className={styles.metrom_logo} />
            <Tabs
                selectedKey={path}
                onSelectionChange={handleOnNavigation}
                size="lg"
                className={styles.tabs}
            >
                <Tab key={"/"} title={t("all_campaigns")} />
                <Tab key={"/campaigns/create"} title={t("new_campaign")} />
            </Tabs>
            <ConnectButton />
        </div>
    );
}

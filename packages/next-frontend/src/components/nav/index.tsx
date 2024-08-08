"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter } from "@/src/navigation";
import { MetromLogo } from "../../assets/metrom-logo";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";
import { ConnectButton } from "../connect-button";

export function Nav() {
    const t = useTranslations("navigation");
    const router = useRouter();
    const path = usePathname();

    function handleOnNavigation(key: React.Key) {
        router.push(key.toString());
    }

    return (
        <div className={styles.root}>
            <MetromLogo className={styles.metromLogo} />
            <Tabs
                selectedKey={path}
                onSelectionChange={handleOnNavigation}
                size="lg"
                className={styles.tabs}
            >
                <Tab key={"/"} title={t("allCampaigns")} />
                <Tab key={"/campaigns/create"} title={t("newCampaign")} />
            </Tabs>
            <ConnectButton />
        </div>
    );
}

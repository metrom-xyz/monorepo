"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "@/src/navigation";
import { MetromLogo } from "../../assets/metrom-logo";
import { useLocale, useTranslations } from "next-intl";
import { ConnectButton } from "../connect-button";
import { Typography } from "@/src/ui/typography";
import classNames from "@/src/utils/classes";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { AllCampaignsIcon } from "@/src/assets/all-campaigns-icon";

import styles from "./styles.module.css";
import Link from "next/link";

const ROUTES = [
    { path: "/", label: "allCampaigns", icon: AllCampaignsIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: NewCampaignIcon },
    { path: "/claims", label: "claims", icon: null },
];

export function Nav() {
    const t = useTranslations("navigation");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const getOnNavigationHandler = useCallback(
        (key: React.Key) => {
            return () => router.push(key.toString());
        },
        [router],
    );

    return (
        <div className={styles.root}>
            <Link href={`/${locale}`}>
                <MetromLogo className={styles.metromLogo} />
            </Link>
            <div className={styles.tabs}>
                {ROUTES.map(({ path, label, icon: Icon }) => (
                    <div
                        key={path}
                        onClick={getOnNavigationHandler(path)}
                        className={classNames(styles.tab, {
                            [styles.tabActive]: pathname === path,
                        })}
                    >
                        {Icon && <Icon className={styles.tabIcon} />}
                        <Typography>{t(label)}</Typography>
                    </div>
                ))}
            </div>
            <div className={styles.chainStuffContainer}>
                <ConnectButton />
            </div>
        </div>
    );
}

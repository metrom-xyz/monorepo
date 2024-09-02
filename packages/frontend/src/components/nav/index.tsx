"use client";

import { Link, usePathname } from "@/src/i18n/routing";
import { MetromLogo } from "../../assets/metrom-logo";
import { useTranslations } from "next-intl";
import { ConnectButton } from "../connect-button";
import { Typography } from "@/src/ui/typography";
import classNames from "@/src/utils/classes";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { AllCampaignsIcon } from "@/src/assets/all-campaigns-icon";

import styles from "./styles.module.css";

const ROUTES = [
    { path: "/", label: "allCampaigns", icon: AllCampaignsIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: NewCampaignIcon },
    { path: "/claims", label: "claims", icon: null },
];

export function Nav() {
    const t = useTranslations("navigation");
    const pathname = usePathname();

    return (
        <div className={styles.root}>
            <Link href="/">
                <MetromLogo className={styles.metromLogo} />
            </Link>
            <div className={styles.tabs}>
                {ROUTES.map(({ path, label, icon: Icon }) => (
                    <Link key={path} href={path}>
                        <div
                            className={classNames(styles.tab, {
                                [styles.tabActive]: pathname === path,
                            })}
                        >
                            {Icon && <Icon className={styles.tabIcon} />}
                            <Typography>{t(label)}</Typography>
                        </div>
                    </Link>
                ))}
            </div>
            <div className={styles.chainStuffContainer}>
                <ConnectButton />
            </div>
        </div>
    );
}

"use client";

import { Link, usePathname } from "@/src/i18n/routing";
import { MetromSquareLogo } from "@/src/assets/metrom-square-logo";
import { useTranslations } from "next-intl";
import { ConnectButton } from "../../connect-button";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { AllCampaignsIcon } from "@/src/assets/all-campaigns-icon";
import { ClaimsIcon } from "@/src/assets/claims";

import styles from "./styles.module.css";

const ROUTES = [
    { path: "/", label: "allCampaigns", icon: AllCampaignsIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: NewCampaignIcon },
    { path: "/claims", label: "claims", icon: ClaimsIcon },
];

interface NavProps {
    header?: boolean;
}

export function Nav({ header }: NavProps) {
    const t = useTranslations("navigation");
    const pathname = usePathname();

    return (
        <div
            className={classNames(styles.root, {
                [styles.header]: header,
            })}
        >
            <div className={styles.main}>
                <Link href="/">
                    <MetromSquareLogo className={styles.metromLogo} />
                </Link>
                <div className={styles.tabs}>
                    {ROUTES.map(({ path, label, icon: Icon }) => (
                        <Link key={path} href={path}>
                            <div
                                className={classNames(styles.tab, {
                                    [styles.tabActive]: pathname === path,
                                    [styles.header]: header,
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
        </div>
    );
}

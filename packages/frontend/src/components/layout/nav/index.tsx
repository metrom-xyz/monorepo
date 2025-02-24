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
import { ThemeSwitcher } from "../../theme-switcher";
import { THEME_SWITCH } from "@/src/commons/env";

import styles from "./styles.module.css";

const ROUTES = [
    { path: "/", label: "allCampaigns", icon: AllCampaignsIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: NewCampaignIcon },
    { path: "/claims", label: "claims", icon: ClaimsIcon },
];

export function Nav() {
    const t = useTranslations("navigation");
    const pathname = usePathname();

    return (
        <div className={classNames(styles.root)}>
            <div className={styles.main}>
                <div className={styles.leftContent}>
                    <Link href="/">
                        <MetromSquareLogo className={styles.metromLogo} />
                    </Link>
                </div>
                <div className={styles.rightContentContainer}>
                    <ConnectButton />
                    {THEME_SWITCH && <ThemeSwitcher />}
                </div>
                <div className={styles.tabs}>
                    {ROUTES.map(({ path, label, icon: Icon }) => (
                        <Link key={path} href={path}>
                            <div
                                className={classNames(styles.tab, {
                                    [styles.tabActive]:
                                        pathname === path ||
                                        (path !== "/" &&
                                            pathname.startsWith(path)),
                                })}
                            >
                                {Icon && <Icon className={styles.tabIcon} />}
                                <Typography weight="medium">
                                    {t(label)}
                                </Typography>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className={styles.mobileNavigationWrapper}>
                    {ROUTES.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            href={path}
                            className={classNames(styles.mobileNavLink, {
                                [styles.tabActive]:
                                    pathname === path ||
                                    (path !== "/" && pathname.startsWith(path)),
                            })}
                        >
                            {Icon && <Icon className={styles.tabIcon} />}
                            <Typography weight="medium" size="sm">
                                {t(label)}
                            </Typography>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

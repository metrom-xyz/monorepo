"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useAccount } from "wagmi";
import { TranslationsKeys } from "@/types/utils";
import { MetromSquareLogo } from "@/assets/logos/metrom-square";
import { ConnectButton } from "@/components/connect-button";
import { NavThemeSwitcher } from "@/components/nav-theme-switcher";
import { NetworkSelect } from "@/components/network-select";

import styles from "./styles.module.css";

const ROUTES: {
    path: string;
    label: TranslationsKeys<"layout.navigation">;
}[] = [{ path: "/", label: "fees" }];

export function Nav() {
    const t = useTranslations("layout.navigation");
    const pathname = usePathname();
    const { address } = useAccount();

    return (
        <div className={styles.root}>
            <div className={styles.main}>
                <div className={styles.leftContent}>
                    <Link href="/">
                        <MetromSquareLogo className={styles.metromLogo} />
                    </Link>
                </div>
                <div className={styles.rightContentContainer}>
                    <NetworkSelect />
                    {!address && <NavThemeSwitcher />}
                    <ConnectButton />
                </div>
                <div className={styles.tabs}>
                    {ROUTES.map(({ path, label }) => {
                        return (
                            <Link key={path} href={path}>
                                <div
                                    className={classNames(styles.tab, {
                                        [styles.tabActive]:
                                            pathname === path ||
                                            (path !== "/" &&
                                                pathname.startsWith(path)),
                                    })}
                                >
                                    <Typography weight="medium">
                                        {t(label)}
                                    </Typography>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <div className={styles.mobileNavigationWrapper}>
                    {ROUTES.map(({ path, label }) => (
                        <Link
                            key={path}
                            href={path}
                            className={classNames(styles.mobileNavLink, {
                                [styles.tabActive]:
                                    pathname === path ||
                                    (path !== "/" && pathname.startsWith(path)),
                            })}
                        >
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

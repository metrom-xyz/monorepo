"use client";

import { Link, usePathname } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { ConnectButton } from "../../connect-button";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { NetworkSelect } from "../../network-select";
import { NavThemeSwitcher } from "../../nav-theme-switcher";
import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Address } from "viem";
import { useClaims } from "@/src/hooks/use-claims";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useAccount } from "@/src/hooks/useAccount";
import { MetromSquareLogo } from "@/src/assets/logos/metrom/metrom-square-logo";
import { ROUTES } from "..";

import styles from "./styles.module.css";

export function TopNav() {
    const t = useTranslations("navigation");
    const pathname = usePathname();
    const { address } = useAccount();
    const { claims } = useClaims();
    const { id: chain } = useChainWithType();
    const activeChains = useActiveChains();

    const pendingClaimsCount = useMemo(() => {
        if (!claims || !address) return undefined;

        const reduced = claims.reduce(
            (acc, claim) => {
                if (!acc[claim.token.address]) acc[claim.token.address] = true;
                return acc;
            },
            {} as Record<Address, boolean>,
        );
        return Object.values(reduced).length;
    }, [claims, address]);

    return (
        <div className={styles.root}>
            <div className={styles.logoWrapper}>
                <Link href="/">
                    <MetromSquareLogo className={styles.logo} />
                </Link>
            </div>
            <div className={styles.rightContentContainer}>
                <NetworkSelect />
                {!address && <NavThemeSwitcher />}
                <ConnectButton />
            </div>
            <div className={styles.mobileNavigationWrapper}>
                {ROUTES.map(({ path, label, icon: Icon }) => {
                    const disabled =
                        path === "/campaigns/create" &&
                        !activeChains.find(({ id }) => id === chain);
                    const active =
                        pathname === path ||
                        (path !== "/" && pathname.startsWith(path));

                    if (disabled)
                        return (
                            <div
                                key={path}
                                className={classNames(
                                    styles.mobileNavLink,
                                    styles.disabled,
                                )}
                            >
                                {Icon && <Icon className={styles.tabIcon} />}
                                <Typography weight="medium">
                                    {t(label)}
                                </Typography>
                            </div>
                        );

                    return (
                        <Link
                            key={path}
                            href={path}
                            onNavigate={(e) => {
                                if (active) e.preventDefault();
                            }}
                            className={classNames(styles.mobileNavLink, {
                                [styles.tabActive]: active,
                            })}
                        >
                            {Icon && <Icon className={styles.tabIcon} />}
                            <Typography weight="medium" size="sm">
                                {t(label)}
                            </Typography>
                            <AnimatePresence>
                                {label === "claim" && pendingClaimsCount && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className={styles.claimsBadge}
                                    >
                                        <Typography
                                            size="xs"
                                            weight="medium"
                                            className={styles.claimsBadgeText}
                                        >
                                            {pendingClaimsCount}
                                        </Typography>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

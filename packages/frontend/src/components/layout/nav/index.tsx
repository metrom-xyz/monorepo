"use client";

import { Link, usePathname } from "@/src/i18n/routing";
import { MetromSquareLogo } from "@/src/assets/logos/metrom/metrom-square-logo";
import { useTranslations } from "next-intl";
import { ConnectButton } from "../../connect-button";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { AllCampaignsIcon } from "@/src/assets/all-campaigns-icon";
import { ClaimsIcon } from "@/src/assets/claims-icon";
import { NetworkSelect } from "../../network-select";
import { NavThemeSwitcher } from "../../nav-theme-switcher";
import { useMemo, type FunctionComponent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SVGIcon } from "@/src/types/common";
import type { TranslationsKeys } from "@/src/types/utils";
import type { Address } from "viem";
import { useClaims } from "@/src/hooks/use-claims";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useAccount } from "@/src/hooks/useAccount";

import styles from "./styles.module.css";

const ROUTES: {
    path: string;
    label: TranslationsKeys<"navigation">;
    icon: FunctionComponent<SVGIcon>;
}[] = [
    { path: "/", label: "discover", icon: AllCampaignsIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: NewCampaignIcon },
    { path: "/claims", label: "claims", icon: ClaimsIcon },
];

export function Nav() {
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
        <div className={classNames(styles.root)}>
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
                                        styles.tab,
                                        styles.disabled,
                                    )}
                                >
                                    {Icon && (
                                        <Icon
                                            className={classNames(
                                                styles.icon,
                                                styles.disabled,
                                                {
                                                    [styles.active]: active,
                                                },
                                            )}
                                        />
                                    )}
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
                            >
                                <div
                                    className={classNames(styles.tab, {
                                        [styles.active]: active,
                                    })}
                                >
                                    {Icon && (
                                        <Icon
                                            className={classNames(styles.icon, {
                                                [styles.active]: active,
                                            })}
                                        />
                                    )}
                                    <Typography
                                        weight="medium"
                                        className={styles.label}
                                    >
                                        {t(label)}
                                    </Typography>
                                    <AnimatePresence>
                                        {label === "claims" &&
                                            pendingClaimsCount && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className={
                                                        styles.claimsBadge
                                                    }
                                                >
                                                    <Typography
                                                        size="xs"
                                                        weight="bold"
                                                        className={
                                                            styles.claimsBadgeText
                                                        }
                                                    >
                                                        {pendingClaimsCount}
                                                    </Typography>
                                                </motion.span>
                                            )}
                                    </AnimatePresence>
                                </div>
                            </Link>
                        );
                    })}
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
                                        styles.tab,
                                        styles.disabled,
                                    )}
                                >
                                    {Icon && (
                                        <Icon className={styles.tabIcon} />
                                    )}
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
                                    [styles.active]: active,
                                })}
                            >
                                {Icon && (
                                    <Icon
                                        className={classNames(styles.icon, {
                                            [styles.active]: active,
                                        })}
                                    />
                                )}
                                <Typography weight="medium" size="sm">
                                    {t(label)}
                                </Typography>
                                <AnimatePresence>
                                    {label === "claims" &&
                                        pendingClaimsCount && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className={styles.claimsBadge}
                                            >
                                                <Typography
                                                    size="xs"
                                                    weight="bold"
                                                    className={
                                                        styles.claimsBadgeText
                                                    }
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
        </div>
    );
}

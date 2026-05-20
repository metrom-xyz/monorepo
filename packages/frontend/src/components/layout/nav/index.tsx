"use client";

import { Link, usePathname } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { ConnectButton } from "../../connect-button";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { DiscoverIcon } from "@/src/assets/discover-icon";
import { ClaimsIcon } from "@/src/assets/claims-icon";
import { useMemo, type FunctionComponent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SVGIcon } from "@/src/types/common";
import type { TranslationsKeys } from "@/src/types/utils";
import type { Address } from "viem";
import { useClaims } from "@/src/hooks/use-claims";
import { useAccount } from "@/src/hooks/useAccount";
import { ThemeToggle } from "../../theme-toggle";
import { MetromSquareLogo } from "@/src/assets/logos/metrom/metrom-square-logo";
import { PlusCircleIcon } from "@/src/assets/plus-circle-icon";
import { EcosystemPicker } from "../ecosystem-picker";

import styles from "./styles.module.css";

const ROUTES: {
    path: string;
    label: TranslationsKeys<"navigation">;
    icon: FunctionComponent<SVGIcon>;
}[] = [
    { path: "/", label: "discover", icon: DiscoverIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: PlusCircleIcon },
    { path: "/claims", label: "claims", icon: ClaimsIcon },
];

export function Nav() {
    const t = useTranslations("navigation");
    const pathname = usePathname();
    const { address } = useAccount();
    const { claims } = useClaims();

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
                    <ThemeToggle />
                    <EcosystemPicker />
                    <ConnectButton />
                </div>
                <div className={styles.tabs}>
                    {ROUTES.map(({ path, label, icon: Icon }) => {
                        const active =
                            pathname === path ||
                            (path !== "/" && pathname.startsWith(path));

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
                        const active =
                            pathname === path ||
                            (path !== "/" && pathname.startsWith(path));

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

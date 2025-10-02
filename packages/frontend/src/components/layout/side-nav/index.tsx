"use client";

import { MetromSquareLogo } from "@/src/assets/logos/metrom/metrom-square-logo";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/routing";
import { useAccount } from "@/src/hooks/useAccount";
import { useClaims } from "@/src/hooks/use-claims";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import type { Address } from "viem";
import { Item } from "./item";
import { ROUTES } from "..";

import styles from "./styles.module.css";

export function SideNav() {
    const t = useTranslations("navigation");
    const pathname = usePathname();
    const { address } = useAccount();
    const { claims } = useClaims();
    const { id: chain } = useChainWithType();
    const activeChains = useActiveChains();

    const pendingClaims = useMemo(() => {
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
            <div className={styles.items}>
                {ROUTES.map(({ path, label, icon: Icon }) => {
                    const disabled =
                        path === "/campaigns/create" &&
                        !activeChains.find(({ id }) => id === chain);
                    const active =
                        pathname === path ||
                        (path !== "/" && pathname.startsWith(path));
                    const claimsCount =
                        label === "claim" ? pendingClaims : undefined;

                    return (
                        <Item
                            key={path}
                            path={path}
                            label={t(label)}
                            icon={Icon}
                            active={active}
                            disabled={disabled}
                            claimsCount={claimsCount}
                        />
                    );
                })}
            </div>
        </div>
    );
}

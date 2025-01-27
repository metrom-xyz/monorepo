"use client";

import { Link, usePathname } from "@/src/i18n/routing";
import { MetromSquareLogo } from "@/src/assets/metrom-square-logo";
import { useTranslations } from "next-intl";
import { ConnectButton } from "../../connect-button";
import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { AllCampaignsIcon } from "@/src/assets/all-campaigns-icon";
import { ClaimsIcon } from "@/src/assets/claims";
import { MenuIcon } from "@/src/assets/menu-icon";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

import styles from "./styles.module.css";

const ROUTES = [
    { path: "/", label: "allCampaigns", icon: AllCampaignsIcon },
    { path: "/campaigns/create", label: "newCampaign", icon: NewCampaignIcon },
    { path: "/claims", label: "claims", icon: ClaimsIcon },
];

export function Nav() {
    const t = useTranslations("navigation");
    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuWrapper, setMenuWrapper] = useState<HTMLDivElement | null>(null);
    const menuPopoverRef = useRef<HTMLDivElement>(null);

    useClickAway(menuPopoverRef, () => {
        setMobileMenuOpen(false);
    });

    function handleMobileMenuOnClick() {
        setMobileMenuOpen((prev) => !prev);
    }

    return (
        <div className={classNames(styles.root)}>
            <div className={styles.main}>
                <div className={styles.leftContent}>
                    <Link href="/">
                        <MetromSquareLogo className={styles.metromLogo} />
                    </Link>
                    <div ref={menuPopoverRef}>
                        <div
                            ref={setMenuWrapper}
                            className={classNames(styles.menuIconWrapper, {
                                [styles.menuOpen]: mobileMenuOpen,
                            })}
                        >
                            <MenuIcon onClick={handleMobileMenuOnClick} />
                        </div>
                        <Popover
                            placement="bottom"
                            anchor={menuWrapper}
                            open={mobileMenuOpen}
                        >
                            <div className={styles.mobileNavigationWrapper}>
                                {ROUTES.map(({ path, label, icon: Icon }) => (
                                    <Link
                                        key={path}
                                        href={path}
                                        onClick={handleMobileMenuOnClick}
                                    >
                                        <div
                                            className={classNames(
                                                styles.mobileNavLink,
                                            )}
                                        >
                                            {Icon && (
                                                <Icon
                                                    className={styles.tabIcon}
                                                />
                                            )}
                                            <Typography>{t(label)}</Typography>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Popover>
                    </div>
                </div>
                <div className={styles.chainStuffContainer}>
                    <ConnectButton />
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
                                <Typography>{t(label)}</Typography>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

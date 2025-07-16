import classNames from "classnames";
import { useClickAway, useWindowSize } from "react-use";
import { useEffect, useRef, useState } from "react";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { type Address } from "viem";
import { Disconnect } from "@/src/assets/disconnect";
import { Activities } from "./activities";
import { useTranslations } from "next-intl";
import { TickIcon } from "@/src/assets/tick-icon";
import { CopyIcon } from "@/src/assets/copy-icon";
import { ThemeSwitcherTabs } from "../../theme-switcher-tabs";
import { formatAmount } from "@/src/utils/format";
import { ErrorIcon } from "@/src/assets/error-icon";
import { RemoveScroll } from "react-remove-scroll";
import { SAFE } from "@/src/commons/env";
import { SafeLogo } from "@/src/assets/logos/safe";
import { useChainData } from "@/src/hooks/useChainData";
import { useIsChainSupported } from "@/src/hooks/use-is-chain-supported/useIsChainSupported";
import { AnimatePresence, motion } from "motion/react";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";

import styles from "./styles.module.css";

export interface Balance {
    symbol: string;
    amount: number;
}

interface AccountMenuProps {
    className?: string;
    chainId: number;
    account: Address;
    balance?: Balance;
    open?: boolean;
    onClose: () => void;
    onDisconnect: () => void;
}

enum Tab {
    Activity,
    Campaigns,
}

// TODO: finish this (add campaigns tab)
export function AccountMenu({
    className,
    chainId,
    account,
    balance,
    open,
    onClose,
    onDisconnect,
}: AccountMenuProps) {
    const t = useTranslations("accountMenu");
    const [tab, setTab] = useState(Tab.Activity);
    const [copied, setCopied] = useState(false);

    const { width } = useWindowSize();
    const rootRef = useRef(null);
    const chainData = useChainData({ chainId });
    const chainSupported = useIsChainSupported({ chainId });

    useClickAway(rootRef, onClose);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timeout);
    }, [copied]);

    function handleDisconnect() {
        onClose();
        onDisconnect();
    }

    function handleActivityClick() {
        setTab(Tab.Activity);
    }

    const handleCopyClick = () => {
        navigator.clipboard.writeText(account).then(() => {
            setCopied(true);
        });
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={classNames(styles.overlay)}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{
                            x: width > 640 ? 448 : 0,
                            y: width > 640 ? 0 : "100%",
                        }}
                        animate={{
                            x: width > 640 ? -448 : 0,
                            y: 0,
                        }}
                        exit={{
                            x: width > 640 ? 448 : 0,
                            y: width > 640 ? 0 : "100%",
                        }}
                        transition={{
                            ease: "easeInOut",
                            duration: 0.2,
                        }}
                        drag={width > 640 ? undefined : "y"}
                        dragConstraints={{
                            top: 0,
                            bottom: 0,
                        }}
                        dragElastic={1}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) onClose();
                        }}
                        className={classNames({
                            [styles.accountMenuHorizontal]: width > 640,
                            [styles.accountMenuVertical]: width <= 640,
                        })}
                    >
                        <RemoveScroll
                            ref={rootRef}
                            className={classNames(styles.root, className)}
                        >
                            <div className={styles.drawBar}></div>
                            <div className={styles.headerWrapper}>
                                <div className={styles.accountContainer}>
                                    <div className={styles.avatarWrapper}>
                                        {SAFE ? (
                                            <div
                                                className={classNames(
                                                    styles.avatar,
                                                    styles.safeAvatar,
                                                )}
                                            >
                                                <SafeLogo
                                                    className={styles.safeLogo}
                                                />
                                            </div>
                                        ) : (
                                            <Avatar
                                                address={account as Address}
                                                height={36}
                                                width={36}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.addressAndBalance}>
                                        <div
                                            className={styles.clipWrapper}
                                            onClick={handleCopyClick}
                                        >
                                            <Account
                                                address={account as Address}
                                                size="lg"
                                                weight="medium"
                                                className={styles.address}
                                            />
                                            <div className={styles.icons}>
                                                {copied ? (
                                                    <TickIcon
                                                        className={
                                                            styles.tickIcon
                                                        }
                                                    />
                                                ) : (
                                                    <CopyIcon
                                                        className={
                                                            styles.copyIcon
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.balance}>
                                            {balance ? (
                                                <>
                                                    <Typography
                                                        light
                                                        weight="medium"
                                                        size="lg"
                                                    >
                                                        {balance.symbol}
                                                    </Typography>
                                                    <Typography
                                                        light
                                                        weight="medium"
                                                        size="lg"
                                                    >
                                                        {formatAmount({
                                                            amount: balance.amount,
                                                        })}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Skeleton
                                                    size="lg"
                                                    width={120}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.rightContent}>
                                    <div
                                        className={classNames(
                                            styles.iconWrapper,
                                            {
                                                [styles.unsupportedChain]:
                                                    !chainSupported,
                                            },
                                        )}
                                    >
                                        {!chainSupported ? (
                                            <ErrorIcon
                                                className={styles.icon}
                                            />
                                        ) : chainData ? (
                                            <chainData.icon
                                                className={styles.icon}
                                            />
                                        ) : null}
                                    </div>
                                    {!SAFE && (
                                        <div
                                            onClick={handleDisconnect}
                                            className={classNames(
                                                styles.iconWrapper,
                                                styles.disconnect,
                                            )}
                                        >
                                            <Disconnect
                                                className={styles.icon}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ThemeSwitcherTabs />
                            <div className={styles.tabs}>
                                <div
                                    onClick={handleActivityClick}
                                    className={classNames(styles.tab, {
                                        [styles.tabActive]:
                                            tab === Tab.Activity,
                                    })}
                                >
                                    <Typography>
                                        {t("tabs.activity")}
                                    </Typography>
                                </div>
                            </div>
                            {tab === Tab.Activity && (
                                <Activities chainId={chainId} />
                            )}
                        </RemoveScroll>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

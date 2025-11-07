import classNames from "classnames";
import { useClickAway, useWindowSize } from "react-use";
import { useEffect, useRef, useState } from "react";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { type Address } from "viem";
import { Disconnect } from "@/src/assets/disconnect-icon";
import { Activities } from "./activities";
import { useTranslations } from "next-intl";
import { TickIcon } from "@/src/assets/tick-icon";
import { CopyIcon } from "@/src/assets/copy-icon";
import { formatAmount } from "@/src/utils/format";
import { RemoveScroll } from "react-remove-scroll";
import { SAFE } from "@/src/commons/env";
import { SafeLogo } from "@/src/assets/logos/safe";
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
    const [copied, setCopied] = useState(false);

    const { width } = useWindowSize();
    const rootRef = useRef(null);

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
                        dragElastic={{ top: 0, bottom: 0.5 }}
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
                                    {SAFE ? (
                                        <div className={styles.safeAvatar}>
                                            <SafeLogo
                                                className={styles.safeLogo}
                                            />
                                        </div>
                                    ) : (
                                        <Avatar
                                            address={account as Address}
                                            height={40}
                                            width={40}
                                        />
                                    )}
                                    <div className={styles.addressAndBalance}>
                                        <div
                                            onClick={handleCopyClick}
                                            className={styles.clipWrapper}
                                        >
                                            <Account
                                                address={account as Address}
                                                size="lg"
                                                weight="medium"
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
                                                        variant="tertiary"
                                                        weight="medium"
                                                        size="sm"
                                                    >
                                                        {balance.symbol}
                                                    </Typography>
                                                    <Typography
                                                        variant="tertiary"
                                                        weight="medium"
                                                        size="sm"
                                                    >
                                                        {formatAmount({
                                                            amount: balance.amount,
                                                        })}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Skeleton
                                                    size="sm"
                                                    width={120}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.rightContent}>
                                    {!SAFE && (
                                        <div
                                            onClick={handleDisconnect}
                                            className={styles.disconnect}
                                        >
                                            <Disconnect />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.activityFeed}>
                                <Typography size="lg" weight="medium">
                                    {t("activityFeed")}
                                </Typography>
                                <Activities chainId={chainId} />
                            </div>
                        </RemoveScroll>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

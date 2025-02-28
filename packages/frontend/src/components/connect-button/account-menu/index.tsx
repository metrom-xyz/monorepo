import classNames from "classnames";
import { useClickAway } from "react-use";
import { useEffect, useRef, useState } from "react";
import { Typography } from "@metrom-xyz/ui";
import { shortenAddress } from "@/src/utils/address";
import { type Address } from "viem";
import { Disconnect } from "@/src/assets/disconnect";
import { Activities } from "./activities";
import { useDisconnect } from "wagmi";
import { useTranslations } from "next-intl";
import { TickIcon } from "@/src/assets/tick-icon";
import { CopyIcon } from "@/src/assets/copy-icon";
import { ThemeSwitcher } from "../../theme-switcher";
import { formatAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface AccountMenuProps {
    className?: string;
    chainId: number;
    account: {
        address: string;
        balanceDecimals?: number;
        balanceFormatted?: string;
        balanceSymbol?: string;
        displayBalance?: string;
        displayName: string;
        ensAvatar?: string;
        ensName?: string;
        hasPendingTransactions: boolean;
    };
    blockie: string;
    onClose: () => void;
}

enum Tab {
    Activity,
    Campaigns,
}

// TODO: finish this (add campaigns tab)
export function AccountMenu({
    className,
    chainId,
    onClose,
    account,
    blockie,
}: AccountMenuProps) {
    const t = useTranslations("accountMenu");
    const [tab, setTab] = useState(Tab.Activity);
    const [copied, setCopied] = useState(false);

    const rootRef = useRef(null);
    const { disconnect } = useDisconnect();

    useClickAway(rootRef, onClose);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timeout);
    }, [copied]);

    function handleDisconnect() {
        onClose();
        disconnect();
    }

    function handleActivityClick() {
        setTab(Tab.Activity);
    }

    const handleCopyClick = () => {
        navigator.clipboard.writeText(account.address).then(() => {
            setCopied(true);
        });
    };

    return (
        <div className={classNames(styles.root, className)} ref={rootRef}>
            <div className={styles.headerWrapper}>
                <div className={styles.accountContainer}>
                    <div className={styles.avatarWrapper}>
                        <img
                            alt="Avatar"
                            src={account.ensAvatar || blockie}
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.addressAndBalanceWrapper}>
                        <div
                            className={styles.clipWrapper}
                            onClick={handleCopyClick}
                        >
                            <Typography
                                size="lg"
                                weight="medium"
                                className={styles.address}
                            >
                                {shortenAddress(account.address as Address)}
                            </Typography>
                            <div className={styles.copyIconContainer}>
                                {copied ? (
                                    <TickIcon className={styles.tickIcon} />
                                ) : (
                                    <CopyIcon className={styles.copyIcon} />
                                )}
                            </div>
                        </div>
                        <div className={styles.balanceWrapper}>
                            <Typography light weight="medium" size="lg">
                                {account.balanceSymbol}
                            </Typography>
                            <Typography light weight="medium" size="lg">
                                {formatAmount({
                                    amount: Number(account.balanceFormatted),
                                })}
                            </Typography>
                        </div>
                    </div>
                </div>
                <div className={styles.disconnectWrapper}>
                    <Disconnect
                        className={styles.disconnectIcon}
                        onClick={handleDisconnect}
                    />
                </div>
            </div>
            <ThemeSwitcher />
            <div className={styles.tabs}>
                <div
                    onClick={handleActivityClick}
                    className={classNames(styles.tab, {
                        [styles.tabActive]: tab === Tab.Activity,
                    })}
                >
                    <Typography>{t("tabs.activity")}</Typography>
                </div>
                {/* TODO: add once we have a proper design */}
                {/* <div
                    onClick={handleCampaignsClick}
                    className={classNames(styles.tab, {
                        [styles.tabActive]: tab === Tab.Campaigns,
                    })}
                >
                    <Typography>{t("tabs.campaigns")}</Typography>
                </div> */}
            </div>
            {tab === Tab.Activity && <Activities chainId={chainId} />}
        </div>
    );
}

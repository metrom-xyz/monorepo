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
import { ThemeSwitcherTabs } from "../../theme-switcher-tabs";
import { formatAmount } from "@/src/utils/format";
import { useChainData } from "@/src/hooks/useChainData";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";
import { ErrorIcon } from "@/src/assets/error-icon";
import { RemoveScroll } from "react-remove-scroll";
import { SAFE } from "@/src/commons/env";
import { SafeLogo } from "@/src/assets/logos/safe";

import styles from "./styles.module.css";
import Image from "next/image";

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
    const chainData = useChainData(chainId);
    const chainSupported = useIsChainSupported(chainId);
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
                                <SafeLogo className={styles.safeLogo} />
                            </div>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                alt="Avatar"
                                src={account.ensAvatar || blockie}
                                className={styles.avatar}
                            />
                        )}
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
                <div className={styles.rightContent}>
                    <div
                        className={classNames(styles.iconWrapper, {
                            [styles.unsupportedChain]: !chainSupported,
                        })}
                    >
                        {!chainSupported ? (
                            <ErrorIcon className={styles.icon} />
                        ) : chainData ? (
                            <chainData.icon className={styles.icon} />
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
                            <Disconnect className={styles.icon} />
                        </div>
                    )}
                </div>
            </div>
            <ThemeSwitcherTabs />
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
        </RemoveScroll>
    );
}

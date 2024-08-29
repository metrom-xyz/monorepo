import classNames from "@/src/utils/classes";
import { useClickAway } from "react-use";
import { useRef, useState } from "react";
import { Typography } from "@/src/ui/typography";
import { shortenAddress } from "@metrom-xyz/sdk";
import { type Address } from "viem";
import { Disconnect } from "@/src/assets/disconnect";
import { Activities } from "./activities";
import { useDisconnect } from "wagmi";

import styles from "./styles.module.css";
import { useTranslations } from "next-intl";

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
    const rootRef = useRef(null);
    const { disconnect } = useDisconnect();

    useClickAway(rootRef, onClose);

    const [tab, setTab] = useState(Tab.Activity);

    function handleDisconnect() {
        onClose();
        disconnect();
    }

    function handleActivityClick() {
        setTab(Tab.Activity);
    }

    function handleCampaignsClick() {
        setTab(Tab.Campaigns);
    }

    return (
        <div className={classNames(styles.root, className)} ref={rootRef}>
            <div className={styles.headerWrapper}>
                <div className={styles.accountContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        alt="Avatar"
                        src={account.ensAvatar || blockie}
                        className={styles.avatar}
                    />
                    <Typography variant="lg" weight="medium">
                        {shortenAddress(account.address as Address)}
                    </Typography>
                </div>
                <Disconnect
                    className={styles.disconnectIcon}
                    onClick={handleDisconnect}
                />
            </div>
            <div className={styles.tabs}>
                <div
                    onClick={handleActivityClick}
                    className={classNames(styles.tab, {
                        [styles.tabActive]: tab === Tab.Activity,
                    })}
                >
                    <Typography>{t("tabs.activity")}</Typography>
                </div>
                <div
                    onClick={handleCampaignsClick}
                    className={classNames(styles.tab, {
                        [styles.tabActive]: tab === Tab.Campaigns,
                    })}
                >
                    <Typography>{t("tabs.campaigns")}</Typography>
                </div>
            </div>
            {tab === Tab.Activity && <Activities chainId={chainId} />}
        </div>
    );
}

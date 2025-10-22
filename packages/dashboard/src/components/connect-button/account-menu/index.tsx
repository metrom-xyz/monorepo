import classNames from "classnames";
import { useClickAway } from "react-use";
import { useEffect, useRef, useState } from "react";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { type Address } from "viem";
import { RemoveScroll } from "react-remove-scroll";
import { useAppKitAccount, useAppKitBalance } from "@reown/appkit/react";
import { type AdapterBlueprint } from "@reown/appkit/adapters";
import { Account } from "../../account";
import { SafeLogo } from "@/assets/logos/safe";
import { useChainData } from "@/hooks/useChainData";
import { useIsChainSupported } from "@/hooks/useIsChainSupported";
import { TickIcon } from "@/assets/tick-icon";
import { CopyIcon } from "@/assets/copy-icon";
import { formatAmount } from "@/utils/format";
import { ErrorIcon } from "@/assets/error-icon";
import { ThemeSwitcherTabs } from "@/components/theme-switcher-tabs";

import styles from "./styles.module.css";

interface AccountMenuProps {
    className?: string;
    chainId: number;
    account: Address;
    onClose: () => void;
}

export function AccountMenu({
    className,
    chainId,
    account,
    onClose,
}: AccountMenuProps) {
    const [copied, setCopied] = useState(false);
    const [balance, setBalance] = useState<AdapterBlueprint.GetBalanceResult>();

    const rootRef = useRef(null);
    const chainData = useChainData(chainId);
    const chainSupported = useIsChainSupported(chainId);
    const { fetchBalance } = useAppKitBalance();
    const { isConnected } = useAppKitAccount();

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetchBalance();
                setBalance(response.data);
            } catch (error) {
                console.error(`Could not fetch account balance`, error);
            }
        };

        if (isConnected && !balance) fetch();
    }, [isConnected, balance, fetchBalance]);

    useClickAway(rootRef, onClose);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timeout);
    }, [copied]);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(account).then(() => {
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
                        <div
                            className={classNames(
                                styles.avatar,
                                styles.safeAvatar,
                            )}
                        >
                            <SafeLogo className={styles.safeLogo} />
                        </div>
                    </div>
                    <div className={styles.addressAndBalanceWrapper}>
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
                            <div className={styles.copyIconContainer}>
                                {copied ? (
                                    <TickIcon className={styles.tickIcon} />
                                ) : (
                                    <CopyIcon className={styles.copyIcon} />
                                )}
                            </div>
                        </div>
                        <div className={styles.balanceWrapper}>
                            {balance ? (
                                <>
                                    <Typography variant="tertiary"weight="medium" size="lg">
                                        {balance.symbol}
                                    </Typography>
                                    <Typography variant="tertiary"weight="medium" size="lg">
                                        {formatAmount({
                                            amount: Number(balance.balance),
                                        })}
                                    </Typography>
                                </>
                            ) : (
                                <Skeleton size="lg" width={120} />
                            )}
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
                </div>
            </div>
            <ThemeSwitcherTabs />
        </RemoveScroll>
    );
}

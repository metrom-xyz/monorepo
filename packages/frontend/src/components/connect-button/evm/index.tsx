"use client";

import { Button } from "@metrom-xyz/ui";
import { cloneElement, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { type Address } from "blo";
import { AccountMenu, type Balance } from "../account-menu";
import { trackFathomEvent } from "@/src/utils/fathom";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { SAFE } from "@/src/commons/env";
import { SAFE_CONNECTOR_ID } from "@/src/commons";
import { toast } from "sonner";
import { SafeLogo } from "@/src/assets/logos/safe";
import { SafeConnectedNotification } from "./safe-connected-notification";
import {
    useAppKit,
    useAppKitAccount,
    useAppKitBalance,
    useAppKitNetwork,
} from "@reown/appkit/react";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import type { ConnectButtonProps } from "..";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

export function ConnectButtonEvm({ customComponent }: ConnectButtonProps) {
    const t = useTranslations();

    const [balance, setBalance] = useState<Balance>();

    const connectors = useConnectors();
    const { connector } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const { open } = useAppKit();
    const { address, isConnected: connected } = useAppKitAccount();
    const { fetchBalance } = useAppKitBalance();
    const { chainId } = useAppKitNetwork();

    const [accountMenu, setAccountMenu] = useState(false);

    useEffect(() => {
        setBalance(undefined);
    }, [chainId]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetchBalance();
                if (!response.data) return;

                const { symbol, balance } = response.data;
                setBalance({
                    symbol,
                    amount: Number(balance),
                });
            } catch (error) {
                console.error(`Could not fetch account balance`, error);
            }
        };

        if (connected && !balance) fetch();
    }, [connected, balance, fetchBalance]);

    useEffect(() => {
        if (!SAFE) return;

        const safeConnector = connectors.find(
            (connector) => connector.id === SAFE_CONNECTOR_ID,
        );
        if (!safeConnector) return;

        if (connector?.id !== SAFE_CONNECTOR_ID) disconnect();

        connect(
            { connector: safeConnector },
            {
                onSuccess: () =>
                    toast.custom((toastId) => (
                        <SafeConnectedNotification toastId={toastId} />
                    )),
                onError: (error) => {
                    console.warn(
                        `Could not connect with Safe connector: ${error}`,
                    );
                },
            },
        );
    }, [connect, connector?.id, connectors, disconnect]);

    async function handleOnConnect() {
        await open();
    }

    function handleAccountMenuOpen() {
        setAccountMenu(true);
        trackFathomEvent("OPEN_SIDEBAR");
    }

    function handleAccountMenuClose() {
        setAccountMenu(false);
    }

    return (
        <div className={commonStyles.root}>
            <div className={commonStyles.wrapper}>
                {connected ? (
                    <>
                        <AccountMenu
                            account={address as Address}
                            chainId={Number(chainId)}
                            open={accountMenu}
                            balance={balance}
                            onClose={handleAccountMenuClose}
                            onDisconnect={disconnect}
                        />
                        <div
                            onClick={handleAccountMenuOpen}
                            className={commonStyles.walletWrapper}
                        >
                            <div className={commonStyles.account}>
                                {SAFE ? (
                                    <div className={styles.safeAvatar}>
                                        <SafeLogo className={styles.safeLogo} />
                                    </div>
                                ) : (
                                    <Avatar
                                        address={address as Address}
                                        height={20}
                                        width={20}
                                    />
                                )}
                                <Account
                                    address={address as Address}
                                    className={commonStyles.displayName}
                                />
                            </div>
                        </div>
                    </>
                ) : customComponent ? (
                    cloneElement(customComponent, {
                        onClick: handleOnConnect,
                    })
                ) : (
                    <Button
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        onClick={handleOnConnect}
                        className={{
                            root: commonStyles.connectButton,
                        }}
                    >
                        {t("navigation.connect")}
                    </Button>
                )}
            </div>
        </div>
    );
}

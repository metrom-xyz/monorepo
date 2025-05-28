"use client";

import { Typography, Button } from "@metrom-xyz/ui";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { useTranslations } from "next-intl";
import { blo, type Address } from "blo";
import { AccountMenu } from "./account-menu";
import { zeroAddress } from "viem";
import classNames from "classnames";
import { trackFathomEvent } from "@/src/utils/fathom";
import { AnimatePresence, motion } from "motion/react";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { SAFE } from "@/src/commons/env";
import { SAFE_CONNECTOR_ID } from "@/src/commons";
import { toast } from "sonner";
import { SafeLogo } from "@/src/assets/logos/safe";
import { SafeConnectedNotification } from "./safe-connected-notification";
import {
    useAppKit,
    useAppKitAccount,
    useAppKitNetwork,
} from "@reown/appkit/react";
import { shortenAddress } from "@/src/utils/address";

import styles from "./styles.module.css";

export function ConnectButton() {
    const t = useTranslations();
    const { width } = useWindowSize();
    const connectors = useConnectors();
    const { connector } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();

    // TODO: resolved ens name and avatar

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

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
        setAccountMenuOpen(true);
        trackFathomEvent("OPEN_SIDEBAR");
    }

    function handleAccountMenuClose() {
        setAccountMenuOpen(false);
    }

    const blockie = blo((address as Address) || zeroAddress);

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                {!isConnected ? (
                    <Button
                        size="sm"
                        onClick={handleOnConnect}
                        className={{
                            root: styles.connectButton,
                        }}
                    >
                        {t("navigation.connect")}
                    </Button>
                ) : (
                    <>
                        <AnimatePresence>
                            {accountMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={classNames(styles.overlay)}
                                />
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {accountMenuOpen && address && chainId && (
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
                                        if (info.offset.y > 100)
                                            handleAccountMenuClose();
                                    }}
                                    className={classNames({
                                        [styles.accountMenuHorizontal]:
                                            width > 640,
                                        [styles.accountMenuVertical]:
                                            width <= 640,
                                    })}
                                >
                                    <AccountMenu
                                        address={address}
                                        blockie={blockie}
                                        chainId={Number(chainId)}
                                        onClose={handleAccountMenuClose}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div
                            className={styles.walletWrapper}
                            onClick={handleAccountMenuOpen}
                        >
                            <div className={styles.account}>
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
                                        src={blockie}
                                        className={styles.avatar}
                                    />
                                )}
                                <Typography className={styles.displayName}>
                                    {shortenAddress(address as Address)}
                                </Typography>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

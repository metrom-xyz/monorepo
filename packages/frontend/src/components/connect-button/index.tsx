"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Typography, Button } from "@metrom-xyz/ui";
import { useState } from "react";
import { useWindowSize } from "react-use";
import { useTranslations } from "next-intl";
import { blo, type Address } from "blo";
import { AccountMenu } from "./account-menu";
import { zeroAddress } from "viem";
import classNames from "classnames";
import { trackFathomEvent } from "@/src/utils/fathom";
import { AnimatePresence, motion } from "motion/react";

import styles from "./styles.module.css";

export function ConnectButton() {
    const t = useTranslations();
    const { width } = useWindowSize();

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    function handleAccountMenuOpen() {
        setAccountMenuOpen(true);
        trackFathomEvent("OPEN_SIDEBAR");
    }

    function handleAccountMenuClose() {
        setAccountMenuOpen(false);
    }

    return (
        <RainbowConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;
                const blockie = blo(
                    (account?.address as Address) || zeroAddress,
                );

                return (
                    <div className={styles.root}>
                        <div className={styles.wrapper}>
                            {!connected ? (
                                <Button
                                    size="sm"
                                    onClick={openConnectModal}
                                    className={{
                                        root: styles.connectButton,
                                    }}
                                >
                                    {t("navigation.connect")}
                                </Button>
                            ) : (
                                <>
                                    <div
                                        className={classNames(styles.overlay, {
                                            [styles.overlayOpen]:
                                                accountMenuOpen,
                                        })}
                                    />
                                    <AnimatePresence>
                                        {accountMenuOpen && (
                                            <motion.div
                                                initial="hide"
                                                animate="show"
                                                exit="hide"
                                                transition={{
                                                    ease: "easeInOut",
                                                    duration: 0.2,
                                                }}
                                                variants={{
                                                    hide: {
                                                        transform:
                                                            width > 640
                                                                ? "translateX(448px)"
                                                                : "translateY(448px)",
                                                    },
                                                    show: {
                                                        transform:
                                                            width > 640
                                                                ? "translateX(-448px)"
                                                                : "translateY(-448px)",
                                                    },
                                                }}
                                                className={classNames({
                                                    [styles.accountMenuHorizontal]:
                                                        width > 640,
                                                    [styles.accountMenuVertical]:
                                                        width <= 640,
                                                })}
                                            >
                                                <AccountMenu
                                                    account={account}
                                                    blockie={blockie}
                                                    chainId={chain.id}
                                                    onClose={
                                                        handleAccountMenuClose
                                                    }
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div
                                        className={styles.walletWrapper}
                                        onClick={handleAccountMenuOpen}
                                    >
                                        <div className={styles.account}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                alt="Avatar"
                                                src={
                                                    account.ensAvatar || blockie
                                                }
                                                className={styles.avatar}
                                            />
                                            <Typography
                                                className={styles.displayName}
                                            >
                                                {account.ensName ||
                                                    account.displayName}
                                            </Typography>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            }}
        </RainbowConnectButton.Custom>
    );
}

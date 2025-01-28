import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Typography, Button, Popover } from "@metrom-xyz/ui";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useRef, useState } from "react";
import { useChainId, useChains, useSwitchChain } from "wagmi";
import { useClickAway, useWindowSize } from "react-use";
import { useTranslations } from "next-intl";
import { ErrorIcon } from "@/src/assets/error-icon";
import { blo, type Address } from "blo";
import { AccountMenu } from "./account-menu";
import { zeroAddress } from "viem";
import classNames from "classnames";
import { CHAIN_DATA } from "@/src/commons";
import { trackFathomEvent } from "@/src/utils/fathom";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./styles.module.css";

export function ConnectButton() {
    const t = useTranslations();
    const chains = useChains();
    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();
    const { width } = useWindowSize();

    const [networkWrapper, setNetworkWrapper] = useState<HTMLDivElement | null>(
        null,
    );
    const [networkPopoverOpen, setNetworkPopoverOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const networksPopoverRef = useRef<HTMLDivElement>(null);

    function handleOpenNetworkPopover() {
        setNetworkPopoverOpen((prev) => !prev);
    }

    useClickAway(networksPopoverRef, () => {
        setNetworkPopoverOpen(false);
    });

    function getSwitchChainHandler(chainId: number) {
        return () => {
            switchChain({ chainId });
            setNetworkPopoverOpen(false);
        };
    }

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
                const ChainIcon =
                    CHAIN_DATA[currentChainId as SupportedChain].icon;

                return (
                    <div className={styles.root}>
                        <div className={styles.wrapper}>
                            <div ref={networksPopoverRef}>
                                <div
                                    ref={setNetworkWrapper}
                                    className={classNames(
                                        styles.networkWrapper,
                                        {
                                            [styles.wrongNetwork]:
                                                chain?.unsupported,
                                        },
                                    )}
                                    onClick={handleOpenNetworkPopover}
                                >
                                    {chain?.unsupported ? (
                                        <ErrorIcon
                                            className={styles.networkIcon}
                                        />
                                    ) : (
                                        <ChainIcon
                                            className={styles.networkIcon}
                                        />
                                    )}
                                </div>
                                <Popover
                                    placement="bottom"
                                    anchor={networkWrapper}
                                    open={networkPopoverOpen}
                                >
                                    <div className={styles.networksWrapper}>
                                        {chains.map((chain) => {
                                            const ChainIcon =
                                                CHAIN_DATA[
                                                    chain.id as SupportedChain
                                                ].icon;

                                            return (
                                                <div
                                                    key={chain.id}
                                                    className={classNames(
                                                        styles.networkRow,
                                                        {
                                                            [styles.activeNetwork]:
                                                                currentChainId ===
                                                                chain.id,
                                                        },
                                                    )}
                                                    onClick={getSwitchChainHandler(
                                                        chain.id,
                                                    )}
                                                >
                                                    <ChainIcon
                                                        className={
                                                            styles.networkIcon
                                                        }
                                                    />
                                                    <Typography>
                                                        {chain.name}
                                                    </Typography>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Popover>
                            </div>
                            {!connected ? (
                                <Button
                                    onClick={openConnectModal}
                                    type="button"
                                    className={{
                                        root: styles.connectButton,
                                    }}
                                >
                                    {t("navigation.connectWallet")}
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
                                                className={
                                                    styles.accountMenuHorizontal
                                                }
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

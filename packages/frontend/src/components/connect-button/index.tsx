import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Typography, Button, Popover } from "@metrom-xyz/ui";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useRef, useState } from "react";
import { useChainId, useChains, useSwitchChain } from "wagmi";
import { useClickAway } from "react-use";
import { useTranslations } from "next-intl";
import { ErrorIcon } from "@/src/assets/error-icon";
import { blo, type Address } from "blo";
import { AccountMenu } from "./account-menu";
import { zeroAddress } from "viem";
import classNames from "classnames";
import { CHAIN_DATA } from "@/src/commons";
import { trackFathomEvent } from "@/src/utils/fathom";
import { useTransition, animated } from "@react-spring/web";

import styles from "./styles.module.css";

export function ConnectButton() {
    const t = useTranslations();
    const chains = useChains();
    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();

    const [networkWrapper, setNetworkWrapper] = useState<HTMLDivElement | null>(
        null,
    );
    const [networkPopoverOpen, setNetworkPopoverOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const networksPopoverRef = useRef<HTMLDivElement>(null);

    const transition = useTransition(accountMenuOpen, {
        from: { transform: "translateX(448px)" },
        enter: { transform: "translateX(-448px)" },
        leave: { transform: "translateX(448px)" },
        config: { duration: 200 },
    });

    function handleOpenNetworkPopover() {
        setNetworkPopoverOpen(true);
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
                            <div
                                className={classNames(styles.networkWrapper, {
                                    [styles.wrongNetwork]: chain?.unsupported,
                                })}
                                ref={setNetworkWrapper}
                                onClick={handleOpenNetworkPopover}
                            >
                                {chain?.unsupported ? (
                                    <ErrorIcon className={styles.networkIcon} />
                                ) : (
                                    <ChainIcon className={styles.networkIcon} />
                                )}
                            </div>
                            <Popover
                                placement="bottom"
                                anchor={networkWrapper}
                                open={networkPopoverOpen}
                                ref={networksPopoverRef}
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
                                                className={styles.networkRow}
                                                onClick={getSwitchChainHandler(
                                                    chain.id,
                                                )}
                                            >
                                                <ChainIcon
                                                    className={
                                                        styles.networkIcon
                                                    }
                                                />
                                                {chain.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Popover>
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
                                    {transition(
                                        (style, open) =>
                                            open && (
                                                <animated.div
                                                    style={style}
                                                    className={
                                                        styles.accountMenu
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
                                                </animated.div>
                                            ),
                                    )}
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

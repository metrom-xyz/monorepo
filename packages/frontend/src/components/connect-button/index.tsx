import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Typography, Button, Popover } from "@metrom-xyz/ui";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useRef, useState, useEffect } from "react";
import {
    useChainId,
    useChains,
    useSwitchChain,
    useConnectors,
    useConnect,
    useAccount,
    useDisconnect,
} from "wagmi";
import { useClickAway } from "react-use";
import { useTranslations } from "next-intl";
import { ErrorIcon } from "@/src/assets/error-icon";
import { blo, type Address } from "blo";
import { AccountMenu } from "./account-menu";
import { zeroAddress } from "viem";
import classNames from "classnames";
import { CHAIN_DATA, SAFE_CONNECTOR_ID } from "@/src/commons";
import { trackFathomEvent } from "@/src/utils/fathom";
import { SafeLogo } from "@/src/assets/logos/safe";
import { SAFE } from "@/src/commons/env";
import { toast } from "sonner";
import { SafeConnectedNotification } from "./safe-connected-notification";

import styles from "./styles.module.css";

export function ConnectButton() {
    const t = useTranslations();
    const chains = useChains();
    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();
    const connectors = useConnectors();
    const { connector } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [networkWrapper, setNetworkWrapper] = useState<HTMLDivElement | null>(
        null,
    );
    const [networkPopoverOpen, setNetworkPopoverOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const networksPopoverRef = useRef<HTMLDivElement>(null);

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

    function handleOpenNetworkPopover() {
        setNetworkPopoverOpen(true);
    }

    useClickAway(networksPopoverRef, () => {
        setNetworkPopoverOpen(false);
    });

    function getSwitchChainHandler(chainId: number) {
        return () => {
            switchChain(
                { chainId },
                {
                    onError: (err) => {
                        console.error(`Could not switch chain: ${err}`);
                    },
                },
            );
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
                                    {chains.map((availableChain) => {
                                        const ChainIcon =
                                            CHAIN_DATA[
                                                availableChain.id as SupportedChain
                                            ].icon;

                                        return (
                                            <div
                                                key={availableChain.id}
                                                className={classNames(
                                                    styles.networkRow,
                                                    {
                                                        [styles.networkRowActive]:
                                                            availableChain.id ===
                                                            chain?.id,
                                                    },
                                                )}
                                                onClick={getSwitchChainHandler(
                                                    availableChain.id,
                                                )}
                                            >
                                                <ChainIcon
                                                    className={
                                                        styles.networkIcon
                                                    }
                                                />
                                                {availableChain.name}
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
                                    <AccountMenu
                                        account={account}
                                        blockie={blockie}
                                        chainId={chain.id}
                                        className={classNames(
                                            styles.accountMenu,
                                            {
                                                [styles.accountMenuOpen]:
                                                    accountMenuOpen,
                                            },
                                        )}
                                        onClose={handleAccountMenuClose}
                                    />
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
                                                    <SafeLogo
                                                        className={
                                                            styles.safeLogo
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    alt="Avatar"
                                                    src={
                                                        account.ensAvatar ||
                                                        blockie
                                                    }
                                                    className={styles.avatar}
                                                />
                                            )}
                                            <Typography>
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

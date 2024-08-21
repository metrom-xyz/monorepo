import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

import styles from "./styles.module.css";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { SettingsIcon } from "@/src/assets/settings-icon";
import { Typography } from "@/src/ui/typography";
import { Button } from "@/src/ui/button";
import { SUPPORTED_CHAIN_ICONS } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { Popover } from "@/src/ui/popover";
import { useRef, useState } from "react";
import { useChains, useSwitchChain } from "wagmi";
import { useClickAway } from "react-use";
import { useTranslations } from "next-intl";

export function ConnectButton() {
    const t = useTranslations();
    const chains = useChains();
    const { switchChain } = useSwitchChain();

    const [networkWrapper, setNetworkWrapper] = useState<HTMLDivElement | null>(
        null,
    );
    const [networkPopoverOpen, setNetworkPopoverOpen] = useState(false);
    const networksPopoverRef = useRef<HTMLDivElement>(null);

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

    return (
        <RainbowConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div className={styles.root}>
                        {(() => {
                            const ChainIcon = chain
                                ? SUPPORTED_CHAIN_ICONS[
                                      chain.id as SupportedChain
                                  ]
                                : () => null;

                            return (
                                <div className={styles.wrapper}>
                                    <div
                                        className={styles.networkWrapper}
                                        ref={setNetworkWrapper}
                                        onClick={handleOpenNetworkPopover}
                                    >
                                        {!chain || chain.unsupported ? (
                                            // TODO: introduce some sort of warning icon instead of the text
                                            "Unsupported"
                                        ) : (
                                            <ChainIcon
                                                className={styles.networkIcon}
                                            />
                                        )}
                                    </div>
                                    <Popover
                                        anchor={networkWrapper}
                                        open={networkPopoverOpen}
                                        ref={networksPopoverRef}
                                    >
                                        <div className={styles.networksWrapper}>
                                            {chains.map((chain) => {
                                                const ChainIcon =
                                                    SUPPORTED_CHAIN_ICONS[
                                                        chain.id as SupportedChain
                                                    ];

                                                return (
                                                    <div
                                                        key={chain.id}
                                                        className={
                                                            styles.networkRow
                                                        }
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
                                        <div className={styles.walletWrapper}>
                                            <div className={styles.account}>
                                                <WalletIcon
                                                    className={styles.icon}
                                                />
                                                <Typography mono>
                                                    {account.ensName ||
                                                        account.displayName}
                                                </Typography>
                                            </div>
                                            {/* TODO: add icon button */}
                                            <div
                                                onClick={openAccountModal}
                                                className={styles.settings}
                                            >
                                                <SettingsIcon
                                                    className={styles.icon}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </RainbowConnectButton.Custom>
    );
}

"use client";

import { cloneElement, useState, type ReactElement } from "react";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/src/context/chain-type";
import { useAccount } from "@/src/hooks/useAccount";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { ConnectButtonEvm } from "./evm";
import { ConnectButtonMvm } from "./mvm";
import { ConnectButtonSvm } from "./svm";
import { ConnectButtonSui } from "./sui";
import { ConnectModal } from "./connect-modal";

import commonStyles from "./styles.module.css";

export interface ConnectButtonProps {
    customComponent?: ReactElement<{ onClick: () => void }>;
}

export function ConnectButton({ customComponent }: ConnectButtonProps) {
    const t = useTranslations();

    const [modalOpen, setModalOpen] = useState(false);

    const { chainType, autoConnecting } = useChainType();
    const { connected } = useAccount();

    function handleModalOnOpen() {
        setModalOpen(true);
    }

    function handleModalOnClose() {
        setModalOpen(false);
    }

    if (!connected)
        return (
            <div className={commonStyles.root}>
                <div className={commonStyles.wrapper}>
                    {customComponent ? (
                        cloneElement(customComponent, {
                            onClick: handleModalOnOpen,
                        })
                    ) : (
                        <Button
                            disabled={autoConnecting}
                            loading={autoConnecting}
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            onClick={handleModalOnOpen}
                            className={{
                                root: commonStyles.connectButton,
                            }}
                        >
                            {t("navigation.connect")}
                        </Button>
                    )}
                    <ConnectModal
                        open={modalOpen}
                        onDismiss={handleModalOnClose}
                    />
                </div>
            </div>
        );

    switch (chainType) {
        case ChainType.Evm:
            return <ConnectButtonEvm />;
        case ChainType.Aptos:
            return <ConnectButtonMvm />;
        case ChainType.Svm:
            return <ConnectButtonSvm />;
        case ChainType.Sui:
            return <ConnectButtonSui />;
        default:
            return null;
    }
}

"use client";

import { Modal, Tabs, Typography, UnderlinedTab, X } from "@metrom-xyz/ui";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/src/context/chain-type";
import { useSwitchEcosystem } from "@/src/hooks/useSwitchEcosystem";
import { ECOSYSTEMS } from "@/src/commons/ecosystems";
import { WalletListEvm } from "./wallets-list/wallet-list-evm";
import { WalletListMvm } from "./wallets-list/wallet-list-mvm";
import { WalletListSvm } from "./wallets-list/wallet-list-svm";
import { WalletListSui } from "./wallets-list/wallet-list-sui";

import styles from "./styles.module.css";

interface ConnectModalProps {
    open: boolean;
    onDismiss: () => void;
}

export function ConnectModal({ open, onDismiss }: ConnectModalProps) {
    return (
        <Modal onDismiss={onDismiss} open={open}>
            {open && <ConnectModalBody onDismiss={onDismiss} />}
        </Modal>
    );
}

interface ConnectModalBodyProps {
    onDismiss: () => void;
}

function ConnectModalBody({ onDismiss }: ConnectModalBodyProps) {
    const t = useTranslations();
    const { chainType } = useChainType();
    const switchEcosystem = useSwitchEcosystem();

    const [selectedChainType, setSelectedChainType] = useState(chainType);

    const handleConnected = useCallback(() => {
        if (chainType !== selectedChainType) {
            switchEcosystem(selectedChainType);
        }
        onDismiss();
    }, [chainType, selectedChainType, switchEcosystem, onDismiss]);

    function getEcosystemChangeHandler(type: ChainType) {
        return () => {
            setSelectedChainType(type);
        };
    }

    let walletList;
    switch (selectedChainType) {
        case ChainType.Evm:
            walletList = <WalletListEvm onConnect={handleConnected} />;
            break;
        case ChainType.Aptos:
            walletList = <WalletListMvm onConnect={handleConnected} />;
            break;
        case ChainType.Svm:
            walletList = <WalletListSvm onConnect={handleConnected} />;
            break;
        case ChainType.Sui:
            walletList = <WalletListSui onConnect={handleConnected} />;
            break;
    }

    return (
        <div className={styles.modal}>
            <div className={styles.title}>
                <Typography weight="medium">{t("wallets.title")}</Typography>
                <X onClick={onDismiss} className={styles.closeIcon} />
            </div>
            <div className={styles.ecosystems}>
                <Tabs value={selectedChainType} onChange={setSelectedChainType}>
                    {ECOSYSTEMS.map(({ name, type, icon: Icon }) => {
                        return (
                            <UnderlinedTab
                                key={type}
                                icon={Icon}
                                value={type}
                                onClick={getEcosystemChangeHandler(type)}
                                className={styles.ecosystemTabIcon}
                            >
                                {name}
                            </UnderlinedTab>
                        );
                    })}
                </Tabs>
            </div>
            <div className={styles.walletsList}>{walletList}</div>
        </div>
    );
}

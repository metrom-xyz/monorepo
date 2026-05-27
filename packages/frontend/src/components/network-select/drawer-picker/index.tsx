import classNames from "classnames";
import { MobileDrawer, Typography } from "@metrom-xyz/ui";
import { RemoveScroll } from "react-remove-scroll";
import { useWindowSize } from "react-use";
import { getCrossVmChainData } from "@/src/utils/chain";
import {
    METROM_APTOS_BASE_URL,
    METROM_SOLANA_BASE_URL,
    SUPPORTED_CHAINS_MVM,
    SUPPORTED_CHAINS_SVM,
} from "@/src/commons";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import type { ChainWithType } from "@/src/types/chain";
import { useChainType } from "@/src/hooks/useChainType";
import { ChainType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface DrawerPickerProps {
    open: boolean;
    chains: ChainWithType[];
    value: number;
    onChange?: (chainId: number) => void;
    onClose: () => void;
}

export function DrawerPicker({
    open,
    chains,
    value,
    onChange,
    onClose,
}: DrawerPickerProps) {
    const chainType = useChainType();
    const { width } = useWindowSize();

    function getOnChangeHandler(chainId: number) {
        if (!onChange) return;
        return () => {
            onChange(chainId);
        };
    }

    return (
        <RemoveScroll enabled={open && width < 640} className={styles.root}>
            <MobileDrawer open={open} onClose={onClose}>
                <div className={styles.networksWrapper}>
                    {chains.map(({ id, type }) => {
                        const chainData = getCrossVmChainData(id, type);

                        if (
                            chainType !== ChainType.Aptos &&
                            SUPPORTED_CHAINS_MVM.includes(id)
                        )
                            return (
                                <a
                                    key={id}
                                    href={METROM_APTOS_BASE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.row}
                                >
                                    {chainData?.icon && (
                                        <chainData.icon
                                            className={commonStyles.icon}
                                        />
                                    )}
                                    <Typography size="xl">
                                        {chainData?.name}
                                    </Typography>
                                    <ArrowRightIcon
                                        className={
                                            commonStyles.externalLinkIcon
                                        }
                                    />
                                </a>
                            );

                        if (
                            chainType !== ChainType.Svm &&
                            SUPPORTED_CHAINS_SVM.includes(id)
                        )
                            return (
                                <a
                                    key={id}
                                    href={METROM_SOLANA_BASE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.row}
                                >
                                    {chainData?.icon && (
                                        <chainData.icon
                                            className={commonStyles.icon}
                                        />
                                    )}
                                    <Typography size="xl">
                                        {chainData?.name}
                                    </Typography>
                                    <ArrowRightIcon
                                        className={
                                            commonStyles.externalLinkIcon
                                        }
                                    />
                                </a>
                            );

                        return (
                            <div
                                key={id}
                                onClick={getOnChangeHandler(id)}
                                className={classNames(styles.row, {
                                    [commonStyles.active]: value === id,
                                })}
                            >
                                {chainData?.icon && (
                                    <chainData.icon
                                        className={commonStyles.icon}
                                    />
                                )}
                                <Typography size="xl">
                                    {chainData?.name}
                                </Typography>
                            </div>
                        );
                    })}
                </div>
            </MobileDrawer>
        </RemoveScroll>
    );
}

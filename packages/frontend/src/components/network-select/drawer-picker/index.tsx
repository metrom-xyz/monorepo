import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { RemoveScroll } from "react-remove-scroll";
import { useWindowSize } from "react-use";
import { MobileDrawer } from "../../mobile-drawer";
import { getCrossVmChainData } from "@/src/utils/chain";
import { APTOS } from "@/src/commons/env";
import { METROM_APTOS_BASE_URL, SUPPORTED_CHAINS_MVM } from "@/src/commons";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import type { ChainWithType } from "@/src/types/chain";

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

                        if (!APTOS && SUPPORTED_CHAINS_MVM.includes(id))
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

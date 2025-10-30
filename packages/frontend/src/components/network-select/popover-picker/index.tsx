import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useWindowSize } from "react-use";
import { getCrossVmChainData } from "@/src/utils/chain";
import { METROM_APTOS_BASE_URL, SUPPORTED_CHAINS_MVM } from "@/src/commons";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { APTOS } from "@/src/commons/env";
import type { ChainWithType } from "@/src/types/chain";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface PopoverPickerProps {
    anchor: Element | null;
    open: boolean;
    chains: readonly ChainWithType[];
    value: number;
    container: HTMLElement | null;
    onChange?: (chainId: number) => void;
    onOpen: (open: boolean) => void;
}

export function PopoverPicker({
    anchor,
    open,
    chains,
    value,
    container,
    onChange,
    onOpen,
}: PopoverPickerProps) {
    const { width } = useWindowSize();

    function getOnChangeHandler(chainId: number) {
        if (!onChange) return;
        return () => {
            onChange(chainId);
        };
    }

    if (width < 640) return null;

    return (
        <Popover
            root={container}
            placement="bottom-start"
            anchor={anchor}
            open={open}
            onOpenChange={onOpen}
            className={styles.root}
        >
            <div
                className={classNames(styles.networksWrapper, {
                    [styles.grid]: chains.length > 1,
                })}
            >
                {chains.map(({ id, type }) => {
                    const chainData = getCrossVmChainData(id, type);

                    if (!APTOS && SUPPORTED_CHAINS_MVM.includes(id))
                        return (
                            <a
                                key={id}
                                href={METROM_APTOS_BASE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.network}
                            >
                                {chainData?.icon && (
                                    <chainData.icon
                                        className={commonStyles.icon}
                                    />
                                )}
                                <Typography>{chainData?.name}</Typography>
                                <ArrowRightIcon
                                    className={commonStyles.externalLinkIcon}
                                />
                            </a>
                        );

                    return (
                        <div
                            key={id}
                            className={classNames(styles.network, {
                                [commonStyles.active]: value === id,
                            })}
                            onClick={getOnChangeHandler(id)}
                        >
                            {chainData?.icon && (
                                <chainData.icon className={commonStyles.icon} />
                            )}
                            <Typography>{chainData?.name}</Typography>
                        </div>
                    );
                })}
            </div>
        </Popover>
    );
}

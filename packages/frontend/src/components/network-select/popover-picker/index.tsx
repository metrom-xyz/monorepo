import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useWindowSize } from "react-use";
import { getChainData } from "@/src/utils/chain";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface PopoverPickerProps {
    anchor: Element | null;
    open: boolean;
    chains: readonly number[];
    value: number;
    onChange?: (chainId: number) => void;
}

export function PopoverPicker({
    anchor,
    open,
    chains,
    value,
    onChange,
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
            placement="bottom-start"
            anchor={anchor}
            open={open}
            className={styles.root}
        >
            <div
                className={classNames(styles.networksWrapper, {
                    [styles.grid]: chains.length > 1,
                })}
            >
                {chains.map((id) => {
                    const chainData = getChainData(id);

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

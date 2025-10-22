import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import type { Chain } from "viem";
import { useWindowSize } from "react-use";
import { getChainData } from "@/utils/chain";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface PopoverPickerProps {
    anchor: Element | null;
    open: boolean;
    chains: readonly Chain[];
    value: number;
    onChange: (chainId: number) => void;
    onOpen: (open: boolean) => void;
}

export function PopoverPicker({
    anchor,
    open,
    chains,
    value,
    onChange,
    onOpen,
}: PopoverPickerProps) {
    const { width } = useWindowSize();

    function getOnChangeHandler(chainId: number) {
        return () => {
            onChange(chainId);
        };
    }

    if (width < 640) return null;

    return (
        <Popover
            anchor={anchor}
            open={open}
            placement="bottom-start"
            onOpenChange={onOpen}
            className={styles.root}
        >
            <div className={styles.networksWrapper}>
                {chains.map((chain) => {
                    const chainData = getChainData(chain.id);

                    return (
                        <div
                            key={chain.id}
                            className={classNames(styles.network, {
                                [commonStyles.active]: value === chain.id,
                            })}
                            onClick={getOnChangeHandler(chain.id)}
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

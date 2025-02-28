import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import type { Chain } from "viem";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface PopoverPickerProps {
    anchor: Element | null;
    open: boolean;
    chains: readonly Chain[];
    value: number;
    onChange: (chainId: number) => void;
}

export function PopoverPicker({
    anchor,
    open,
    chains,
    value,
    onChange,
}: PopoverPickerProps) {
    function getOnChangeHandler(chainId: number) {
        return () => {
            onChange(chainId);
        };
    }

    return (
        <Popover
            placement="bottom"
            anchor={anchor}
            open={open}
            className={styles.root}
        >
            <div className={commonStyles.networksWrapper}>
                {chains.map((chain) => {
                    const { icon: ChainIcon, name } =
                        CHAIN_DATA[chain.id as SupportedChain];

                    return (
                        <div
                            key={chain.id}
                            className={classNames(styles.row, {
                                [commonStyles.active]: value === chain.id,
                            })}
                            onClick={getOnChangeHandler(chain.id)}
                        >
                            <ChainIcon className={commonStyles.icon} />
                            <Typography>{name}</Typography>
                        </div>
                    );
                })}
            </div>
        </Popover>
    );
}

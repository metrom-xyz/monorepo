import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import type { Chain } from "viem";
import { useWindowSize } from "react-use";
import { getChainData } from "@/src/utils/chain";

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
    const { width } = useWindowSize();

    function getOnChangeHandler(chainId: number) {
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
            <div className={styles.networksWrapper}>
                {chains.map((chain) => {
                    const { icon: ChainIcon, name } = getChainData(chain.id);

                    return (
                        <div
                            key={chain.id}
                            className={classNames(styles.network, {
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

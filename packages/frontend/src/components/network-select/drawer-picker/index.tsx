import type { Chain } from "viem";
import { CHAIN_DATA } from "@/src/commons";
import { type SupportedChain } from "@metrom-xyz/contracts";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { RemoveScroll } from "react-remove-scroll";
import { useWindowSize } from "react-use";
import { MobileDrawer } from "../../mobile-drawer";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface DrawerPickerProps {
    open: boolean;
    chains: readonly Chain[];
    value: number;
    onChange: (chainId: number) => void;
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
        return () => {
            onChange(chainId);
        };
    }

    return (
        <RemoveScroll enabled={open && width < 640} className={styles.root}>
            <MobileDrawer open={open} onClose={onClose}>
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
                                <Typography size="xl">{name}</Typography>
                            </div>
                        );
                    })}
                </div>
            </MobileDrawer>
        </RemoveScroll>
    );
}

import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { useClickAway, useWindowSize } from "react-use";
import type { Chain } from "viem";
import { CHAIN_DATA } from "@/src/commons";
import { type SupportedChain } from "@metrom-xyz/contracts";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";

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
    const pickerRef = useRef(null);

    const { width } = useWindowSize();
    useClickAway(pickerRef, () => {
        if (width > 640) return;
        onClose();
    });

    function getOnChangeHandler(chainId: number) {
        return () => {
            onChange(chainId);
        };
    }

    return (
        <div className={styles.root}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ ease: "easeInOut", duration: 0.2 }}
                        className={styles.wrapper}
                    >
                        <div ref={pickerRef} className={styles.drawer}>
                            <div className={styles.networksWrapper}>
                                {chains.map((chain) => {
                                    const { icon: ChainIcon, name } =
                                        CHAIN_DATA[chain.id as SupportedChain];

                                    return (
                                        <div
                                            key={chain.id}
                                            className={classNames(styles.row, {
                                                [commonStyles.active]:
                                                    value === chain.id,
                                            })}
                                            onClick={getOnChangeHandler(
                                                chain.id,
                                            )}
                                        >
                                            <ChainIcon
                                                className={commonStyles.icon}
                                            />
                                            <Typography size="xl">
                                                {name}
                                            </Typography>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

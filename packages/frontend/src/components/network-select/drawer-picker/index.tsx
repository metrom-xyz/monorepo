import { AnimatePresence, motion } from "motion/react";
import type { Chain } from "viem";
import { CHAIN_DATA } from "@/src/commons";
import { type SupportedChain } from "@metrom-xyz/contracts";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { RemoveScroll } from "react-remove-scroll";
import { useWindowSize } from "react-use";

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
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ ease: "easeInOut", duration: 0.2 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={1}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) onClose();
                        }}
                        className={styles.wrapper}
                    >
                        <div className={styles.drawer}>
                            <div className={styles.drawBar}></div>
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
        </RemoveScroll>
    );
}

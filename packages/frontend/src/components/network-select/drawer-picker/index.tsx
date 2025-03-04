import { AnimatePresence, motion } from "motion/react";
import type { Chain } from "viem";
import { CHAIN_DATA } from "@/src/commons";
import { type SupportedChain } from "@metrom-xyz/contracts";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { useEffect } from "react";
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

    useEffect(() => {
        if (width > 640) return;
        const html = document.documentElement;

        if (open) html.classList.add("no-scroll");
        else html.classList.remove("no-scroll");
    }, [width, open]);

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
        </div>
    );
}

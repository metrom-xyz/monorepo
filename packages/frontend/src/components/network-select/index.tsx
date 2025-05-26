import classNames from "classnames";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useRef, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { PopoverPicker } from "./popover-picker";
import { DrawerPicker } from "./drawer-picker";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "motion/react";
import { useChainData } from "@/src/hooks/useChainData";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";
import { useActiveChains } from "@/src/hooks/useActiveChains";

import styles from "./styles.module.css";

export function NetworkSelect() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const supportedActiveChains = useActiveChains();
    const selectedChainId = useChainId();
    const chainData = useChainData(selectedChainId);
    const chainSupported = useIsChainSupported(selectedChainId);

    const { switchChain } = useSwitchChain();

    useClickAway(rootRef, () => {
        setPickerOpen(false);
    });

    function handleNetworkPickerOnToggle() {
        setPickerOpen((prev) => !prev);
    }

    function handleNetworkPickerOnClose() {
        setPickerOpen((prev) => !prev);
    }

    function handleNetworkOnChange(chainId: number) {
        switchChain(
            { chainId },
            {
                onError: (err) => {
                    console.error(`Could not switch chain: ${err}`);
                },
            },
        );
        setPickerOpen(false);
    }

    return (
        <>
            <AnimatePresence>
                {pickerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={classNames(styles.overlay)}
                    />
                )}
            </AnimatePresence>
            <div ref={rootRef}>
                <div
                    ref={setWrapper}
                    className={classNames(styles.networkWrapper, {
                        [styles.wrong]: !chainSupported,
                    })}
                    onClick={handleNetworkPickerOnToggle}
                >
                    {!chainSupported ? (
                        <ErrorIcon className={styles.icon} />
                    ) : chainData ? (
                        <chainData.icon className={styles.icon} />
                    ) : null}
                </div>
                <PopoverPicker
                    anchor={wrapper}
                    chains={supportedActiveChains}
                    open={pickerOpen}
                    value={selectedChainId}
                    onChange={handleNetworkOnChange}
                />
                <DrawerPicker
                    chains={supportedActiveChains}
                    open={pickerOpen}
                    value={selectedChainId}
                    onChange={handleNetworkOnChange}
                    onClose={handleNetworkPickerOnClose}
                />
            </div>
        </>
    );
}

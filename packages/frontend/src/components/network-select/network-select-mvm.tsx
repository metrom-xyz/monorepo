import classNames from "classnames";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useCallback, useRef, useState } from "react";
import { PopoverPicker } from "./popover-picker";
import { DrawerPicker } from "./drawer-picker";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "motion/react";
import { useChainData } from "@/src/hooks/useChainData";
import { useIsChainSupported } from "@/src/hooks/use-is-chain-supported";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import { useChainId } from "@/src/hooks/useChainId";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { chainIdToAptosNetwork } from "@/src/utils/chain";

import styles from "./styles.module.css";

export function NetworkSelectMvm() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const activeChains = useActiveChains();
    const selectedChainId = useChainId();
    const { changeNetwork, connected } = useWallet();
    const chainData = useChainData({ chainId: selectedChainId });
    const chainSupported = useIsChainSupported({ chainId: selectedChainId });

    useClickAway(rootRef, () => {
        setPickerOpen(false);
    });

    function handleNetworkPickerOnToggle() {
        setPickerOpen((prev) => !prev);
    }

    function handleNetworkPickerOnClose() {
        setPickerOpen((prev) => !prev);
    }

    const handleNetworkOnChange = useCallback(
        async (chainId: number) => {
            const network = chainIdToAptosNetwork(chainId);
            if (!network) return;

            if (connected) await changeNetwork(network);
            setPickerOpen(false);
        },
        [connected, changeNetwork],
    );

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
                    chains={activeChains}
                    open={pickerOpen}
                    value={selectedChainId}
                    onChange={handleNetworkOnChange}
                />
                <DrawerPicker
                    chains={activeChains}
                    open={pickerOpen}
                    value={selectedChainId}
                    onChange={handleNetworkOnChange}
                    onClose={handleNetworkPickerOnClose}
                />
            </div>
        </>
    );
}

import classNames from "classnames";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useRef, useState } from "react";
import { PopoverPicker } from "./popover-picker";
import { DrawerPicker } from "./drawer-picker";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "motion/react";
import { useChainData } from "@/src/hooks/useChainData";
import { useIsChainSupported } from "@/src/hooks/use-is-chain-supported/useIsChainSupported";
import { useActiveChains } from "@/src/hooks/use-active-chains/useActiveChains";
import {
    APTOS_NETWORK_ID,
    useChainIdMvm,
} from "@/src/hooks/use-chain-id/useChainIdMvm";
import { useWallet, type Network } from "@aptos-labs/wallet-adapter-react";

import styles from "./styles.module.css";

export function NetworkSelectMvm() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const activeChains = useActiveChains();
    const selectedChainId = useChainIdMvm();
    const { changeNetwork } = useWallet();
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

    function handleNetworkOnChange(chainId: number) {
        const network = Object.entries(APTOS_NETWORK_ID).find(
            ([, id]) => id === chainId,
        );

        if (!network) return;

        changeNetwork(network[0] as Network);
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

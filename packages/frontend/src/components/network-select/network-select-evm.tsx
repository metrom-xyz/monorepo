import classNames from "classnames";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useEffect, useRef, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { PopoverPicker } from "./popover-picker";
import { DrawerPicker } from "./drawer-picker";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "motion/react";
import { useChainData } from "@/src/hooks/useChainData";
import { useIsChainSupported } from "@/src/hooks/use-is-chain-supported/useIsChainSupported";
import { useActiveChains } from "@/src/hooks/use-active-chains/useActiveChains";

import styles from "./styles.module.css";

export function NetworkSelectEvm() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const activeChains = useActiveChains();
    const selectedChainId = useChainId();
    const chainData = useChainData(selectedChainId);
    const chainSupported = useIsChainSupported({ chainId: selectedChainId });
    const { address } = useAccount();
    const { switchChain } = useSwitchChain();

    // When no wallet is connected, Wagmi defaults to mainnet.
    // Since mainnet is not marked as active in our config, we need to
    // manually switch to the first supported active chain.
    useEffect(() => {
        if (!!address) return;

        const supported = activeChains.some((id) => id === selectedChainId);
        if (!supported) switchChain({ chainId: activeChains[0] });
    }, [activeChains, address, selectedChainId, switchChain]);

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

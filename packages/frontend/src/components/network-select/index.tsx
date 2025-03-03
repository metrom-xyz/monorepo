import classNames from "classnames";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useRef, useState } from "react";
import { useChainId, useChains, useSwitchChain } from "wagmi";
import { PopoverPicker } from "./popover-picker";
import { DrawerPicker } from "./drawer-picker";
import { useClickAway } from "react-use";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";
import { useChainData } from "@/src/hooks/useChainData";

import styles from "./styles.module.css";

export function NetworkSelect() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const supportedChains = useChains();
    const selectedChainId = useChainId();
    const chainData = useChainData(selectedChainId);
    const chainSupported = useIsChainSupported(selectedChainId);

    const { switchChain } = useSwitchChain();

    useClickAway(rootRef, () => {
        setPickerOpen(false);
    });

    function handleToggleNetworkPicker() {
        setPickerOpen((prev) => !prev);
    }

    function handleNetworkOnChange(chainId: number) {
        switchChain({ chainId });
        setPickerOpen(false);
    }

    return (
        <div ref={rootRef}>
            <div
                ref={setWrapper}
                className={classNames(styles.networkWrapper, {
                    [styles.wrong]: !chainSupported,
                })}
                onClick={handleToggleNetworkPicker}
            >
                {chainSupported && chainData ? (
                    <chainData.icon className={styles.icon} />
                ) : (
                    <ErrorIcon className={styles.icon} />
                )}
            </div>
            <div
                className={classNames(styles.overlay, {
                    [styles.overlayOpen]: pickerOpen,
                })}
            />
            <PopoverPicker
                anchor={wrapper}
                chains={supportedChains}
                open={pickerOpen}
                value={selectedChainId}
                onChange={handleNetworkOnChange}
            />
            <DrawerPicker
                chains={supportedChains}
                open={pickerOpen}
                value={selectedChainId}
                onChange={handleNetworkOnChange}
            />
        </div>
    );
}

import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useMemo, useRef, useState } from "react";
import { useClickAway, useWindowSize } from "react-use";
import { useAccount, useChainId, useChains, useSwitchChain } from "wagmi";
import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { PopoverPicker } from "./popover-picker";
import { DrawerPicker } from "./drawer-picker";

import styles from "./styles.module.css";

export function NetworkSelect() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const { width } = useWindowSize();
    const supportedChains = useChains();
    const selectedChainId = useChainId();
    const { chain: connectedChain, isConnected } = useAccount();

    const { switchChain } = useSwitchChain();

    const unsupported = useMemo(() => {
        return (
            isConnected &&
            (!connectedChain ||
                !supportedChains.some(({ id }) => id === selectedChainId))
        );
    }, [supportedChains, connectedChain, isConnected, selectedChainId]);

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

    const ChainIcon = CHAIN_DATA[selectedChainId as SupportedChain].icon;

    return (
        <div ref={rootRef}>
            <div
                ref={setWrapper}
                className={classNames(styles.networkWrapper, {
                    [styles.wrong]: unsupported,
                })}
                onClick={handleToggleNetworkPicker}
            >
                {unsupported ? (
                    <ErrorIcon className={styles.icon} />
                ) : (
                    <ChainIcon className={styles.icon} />
                )}
            </div>
            <div
                className={classNames(styles.overlay, {
                    [styles.overlayOpen]: pickerOpen,
                })}
            />
            {width > 640 ? (
                <PopoverPicker
                    anchor={wrapper}
                    chains={supportedChains}
                    open={pickerOpen}
                    value={selectedChainId}
                    onChange={handleNetworkOnChange}
                />
            ) : (
                <DrawerPicker
                    chains={supportedChains}
                    open={pickerOpen}
                    value={selectedChainId}
                    onChange={handleNetworkOnChange}
                    onClose={handleToggleNetworkPicker}
                />
            )}
        </div>
    );
}

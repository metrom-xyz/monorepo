import classNames from "classnames";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useCallback, useRef, useState } from "react";
import { PopoverPicker } from "./popover-picker";
import { DrawerPicker } from "./drawer-picker";
import { useClickAway } from "react-use";
import { useChainData } from "@/src/hooks/useChainData";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { chainIdToAptosNetwork } from "@/src/utils/chain";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export function NetworkSelectMvm() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const activeChains = useActiveChains();
    const { id: selectedChainId } = useChainWithType();
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

            if (connected) await changeNetwork(network as string as Network);
            setPickerOpen(false);
        },
        [connected, changeNetwork],
    );

    return (
        <div ref={rootRef}>
            <div
                ref={setWrapper}
                onClick={handleNetworkPickerOnToggle}
                className={classNames(styles.networkWrapper, {
                    [styles.wrong]: !chainSupported,
                    [styles.open]: pickerOpen,
                })}
            >
                {!chainSupported ? (
                    <ErrorIcon className={styles.errorIcon} />
                ) : chainData ? (
                    <>
                        <chainData.icon className={styles.icon} />
                        <Typography weight="medium">
                            {chainData.name}
                        </Typography>
                    </>
                ) : null}
            </div>
            <PopoverPicker
                anchor={wrapper}
                container={rootRef.current}
                chains={activeChains}
                open={pickerOpen}
                value={selectedChainId}
                onOpen={setPickerOpen}
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
    );
}

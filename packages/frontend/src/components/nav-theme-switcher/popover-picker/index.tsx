import { Popover } from "@metrom-xyz/ui";
import { ThemeSwitcherTabs } from "../../theme-switcher-tabs";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

interface PopoverPickerProps {
    anchor: Element | null;
    open: boolean;
    container: HTMLElement | null;
    onOpen: (open: boolean) => void;
}

export function PopoverPicker({
    anchor,
    open,
    container,
    onOpen,
}: PopoverPickerProps) {
    const { width } = useWindowSize();

    if (width < 640) return null;

    return (
        <Popover
            root={container}
            placement="bottom-start"
            anchor={anchor}
            open={open}
            onOpenChange={onOpen}
            className={styles.root}
        >
            <ThemeSwitcherTabs popover className={styles.tabs} />
        </Popover>
    );
}

import { Popover } from "@metrom-xyz/ui";
import { ThemeSwitcherTabs } from "@/components/theme-switcher-tabs";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

interface PopoverPickerProps {
    anchor: Element | null;
    open: boolean;
    onOpen: (open: boolean) => void;
}

export function PopoverPicker({ anchor, open, onOpen }: PopoverPickerProps) {
    const { width } = useWindowSize();

    if (width < 640) return null;

    return (
        <Popover
            placement="bottom-start"
            open={open}
            anchor={anchor}
            onOpenChange={onOpen}
            className={styles.root}
        >
            <ThemeSwitcherTabs popover className={styles.tabs} />
        </Popover>
    );
}

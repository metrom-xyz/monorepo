import { Popover } from "@metrom-xyz/ui";
import { ThemeSwitcherTabs } from "@/components/theme-switcher-tabs";

import styles from "./styles.module.css";

interface PopoverPickerProps {
    anchor: Element | null;
    open: boolean;
}

export function PopoverPicker({ anchor, open }: PopoverPickerProps) {
    return (
        <Popover
            placement="bottom-start"
            anchor={anchor}
            open={open}
            className={styles.root}
        >
            <ThemeSwitcherTabs popover className={styles.tabs} />
        </Popover>
    );
}

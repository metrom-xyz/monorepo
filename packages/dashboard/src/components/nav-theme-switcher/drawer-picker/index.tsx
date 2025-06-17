import { RemoveScroll } from "react-remove-scroll";
import { useWindowSize } from "react-use";
import { ThemeSwitcherTabs } from "../../theme-switcher-tabs";
import { MobileDrawer } from "../../mobile-drawer";

import styles from "./styles.module.css";

interface DrawerPickerProps {
    open: boolean;
    onClose: () => void;
}

export function DrawerPicker({ open, onClose }: DrawerPickerProps) {
    const { width } = useWindowSize();

    return (
        <RemoveScroll enabled={open && width < 640} className={styles.root}>
            <MobileDrawer open={open} onClose={onClose}>
                <ThemeSwitcherTabs />
            </MobileDrawer>
        </RemoveScroll>
    );
}

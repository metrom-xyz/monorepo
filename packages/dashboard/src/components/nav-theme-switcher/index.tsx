import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { DrawerPicker } from "./drawer-picker";
import { AnimatePresence, motion } from "motion/react";
import { PopoverPicker } from "./popover-picker";
import { useClickAway } from "react-use";
import { Theme } from "@/types/common";
import { MoonIcon } from "@/assets/moon-icon";
import { SunIcon } from "@/assets/sun-icon";

import styles from "./styles.module.css";

export function NavThemeSwitcher() {
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    const rootRef = useRef<HTMLDivElement>(null);

    useClickAway(rootRef, () => {
        setPickerOpen(false);
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleThemePickerOnToggle() {
        setPickerOpen((prev) => !prev);
    }

    function handleThemePickerOnClose() {
        setPickerOpen(false);
    }

    if (!mounted) return;

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
                    className={classNames(styles.themeWrapper)}
                    onClick={handleThemePickerOnToggle}
                >
                    {resolvedTheme === Theme.Dark && <MoonIcon />}
                    {resolvedTheme === Theme.Light && <SunIcon />}
                </div>
                <PopoverPicker
                    anchor={wrapper}
                    open={pickerOpen}
                    onOpen={setPickerOpen}
                />
                <DrawerPicker
                    open={pickerOpen}
                    onClose={handleThemePickerOnClose}
                />
            </div>
        </>
    );
}

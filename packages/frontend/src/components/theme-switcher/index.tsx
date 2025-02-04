import { Theme } from "@/src/types";
import { Popover } from "@metrom-xyz/ui";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { MoonIcon } from "@/src/assets/moon-icon";
import { SunIcon } from "@/src/assets/sun-icon";
import classNames from "classnames";
import { useTheme } from "next-themes";

import styles from "./styles.module.css";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useClickAway(popoverRef, () => {
        setPopoverOpen(false);
    });

    function handlePopoverOpen() {
        setPopoverOpen((prev) => !prev);
    }

    function getThemeChangeHandler(value: Theme) {
        return () => {
            const html = document.documentElement;
            html.classList.add("no-transition");

            setTheme(value);

            requestAnimationFrame(() => {
                setTimeout(() => {
                    html.classList.remove("no-transition");
                }, 1);
            });
        };
    }

    if (!mounted) return null;

    return (
        <div ref={popoverRef} className={styles.root}>
            <div
                ref={setWrapper}
                onClick={handlePopoverOpen}
                className={classNames(styles.wrapper)}
            >
                {theme === Theme.Dark && (
                    <MoonIcon className={styles.themeIcon} />
                )}
                {theme === Theme.Light && (
                    <SunIcon className={styles.themeIcon} />
                )}
            </div>
            <Popover placement="bottom" anchor={wrapper} open={popoverOpen}>
                <div className={styles.themesContainer}>
                    <div
                        onClick={getThemeChangeHandler(Theme.Dark)}
                        className={classNames(styles.themeButton, {
                            [styles.active]: theme === Theme.Dark,
                        })}
                    >
                        <MoonIcon className={styles.themeIcon} />
                    </div>
                    <div
                        onClick={getThemeChangeHandler(Theme.Light)}
                        className={classNames(styles.themeButton, {
                            [styles.active]: theme === Theme.Light,
                        })}
                    >
                        <SunIcon className={styles.themeIcon} />
                    </div>
                </div>
            </Popover>
        </div>
    );
}

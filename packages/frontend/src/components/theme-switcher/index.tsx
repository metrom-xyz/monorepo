import { Theme } from "@/src/types/common";
import { useEffect, useState } from "react";
import { MoonIcon } from "@/src/assets/moon-icon";
import { SunIcon } from "@/src/assets/sun-icon";
import classNames from "classnames";
import { useTheme } from "next-themes";

import styles from "./styles.module.css";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleThemeOnChange() {
        const html = document.documentElement;
        html.classList.add("no-transition");

        if (resolvedTheme === Theme.Dark) setTheme(Theme.Light);
        else setTheme(Theme.Dark);

        requestAnimationFrame(() => {
            setTimeout(() => {
                html.classList.remove("no-transition");
            }, 1);
        });
    }

    if (!mounted)
        return (
            <div className={styles.root}>
                <div
                    className={classNames(styles.wrapper, styles.loading)}
                ></div>
            </div>
        );

    return (
        <div className={styles.root} onClick={handleThemeOnChange}>
            <div className={classNames(styles.wrapper)}>
                {resolvedTheme === Theme.Dark && (
                    <MoonIcon className={styles.themeIcon} />
                )}
                {resolvedTheme === Theme.Light && (
                    <SunIcon className={styles.themeIcon} />
                )}
            </div>
        </div>
    );
}

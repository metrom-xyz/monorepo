import { MoonIcon } from "@/src/assets/moon-icon";
import { SunIcon } from "@/src/assets/sun-icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Theme } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export function ThemeToggle() {
    const { resolvedTheme: theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleOnToggle() {
        const html = document.documentElement;
        html.classList.add("no-transition");

        setTheme((prev) => (prev === Theme.Dark ? Theme.Light : Theme.Dark));

        requestAnimationFrame(() => {
            setTimeout(() => {
                html.classList.remove("no-transition");
            }, 1);
        });
    }

    if (!mounted) return;

    return (
        <div onClick={handleOnToggle} className={styles.root}>
            {theme === Theme.Dark ? (
                <MoonIcon className={styles.icon} />
            ) : (
                <SunIcon className={styles.icon} />
            )}
        </div>
    );
}

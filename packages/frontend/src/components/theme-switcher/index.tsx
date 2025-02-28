import { Theme } from "@/src/types/common";
import { useEffect, useState } from "react";
import { MoonIcon } from "@/src/assets/moon-icon";
import { SunIcon } from "@/src/assets/sun-icon";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { Tab, Tabs, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function ThemeSwitcher() {
    const t = useTranslations("theme");
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleThemeOnChange(value: Theme) {
        const html = document.documentElement;
        html.classList.add("no-transition");

        setTheme(value);

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
        <Tabs
            onChange={handleThemeOnChange}
            value={theme as Theme}
            className={styles.root}
        >
            <Tab
                value={Theme.System}
                className={classNames(styles.tab, {
                    [styles.active]: theme === Theme.System,
                })}
            >
                <Typography weight="medium">{t("auto")}</Typography>
            </Tab>
            <Tab
                value={Theme.Dark}
                className={classNames(styles.tab, {
                    [styles.active]: theme === Theme.Dark,
                })}
            >
                <MoonIcon className={styles.icon} />
            </Tab>
            <Tab
                value={Theme.Light}
                className={classNames(styles.tab, {
                    [styles.active]: theme === Theme.Light,
                })}
            >
                <SunIcon className={styles.icon} />
            </Tab>
        </Tabs>
    );
}

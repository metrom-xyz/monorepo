import { Theme } from "@/src/types/common";
import { MoonIcon } from "@/src/assets/moon-icon";
import { SunIcon } from "@/src/assets/sun-icon";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { Tab, Tabs, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface ThemeSwitcherTabsProps {
    popover?: boolean;
    className?: string;
}

export function ThemeSwitcherTabs({
    popover,
    className,
}: ThemeSwitcherTabsProps) {
    const t = useTranslations("theme");
    const { theme, setTheme } = useTheme();

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

    return (
        <Tabs
            onChange={handleThemeOnChange}
            value={theme as Theme}
            className={classNames(styles.root, className, {
                [styles.popover]: popover,
            })}
        >
            <Tab
                value={Theme.System}
                className={classNames(styles.tab, {
                    [styles.active]: theme === Theme.System,
                    [styles.popover]: popover,
                })}
            >
                <Typography>{t("system")}</Typography>
            </Tab>
            <Tab
                value={Theme.Dark}
                className={classNames(styles.tab, {
                    [styles.active]: theme === Theme.Dark,
                    [styles.popover]: popover,
                })}
            >
                <MoonIcon className={styles.icon} />
            </Tab>
            <Tab
                value={Theme.Light}
                className={classNames(styles.tab, {
                    [styles.active]: theme === Theme.Light,
                    [styles.popover]: popover,
                })}
            >
                <SunIcon className={styles.icon} />
            </Tab>
        </Tabs>
    );
}

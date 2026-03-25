import classNames from "classnames";
import type { TabProps } from "..";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

export function Tab<T>({
    onClick,
    size = "base",
    icon: Icon,
    active,
    value,
    children,
    className,
}: TabProps<T>) {
    function handleOnClick() {
        if (onClick) onClick(value);
    }

    return (
        <div
            onClick={handleOnClick}
            className={classNames(
                "root",
                styles.root,
                commonStyles.tab,
                className,
                {
                    [styles.active]: value === active,
                    [commonStyles[size]]: true,
                },
            )}
        >
            {Icon && (
                <Icon
                    className={classNames("icon", styles.icon, {
                        [styles[size]]: true,
                    })}
                />
            )}
            {children}
        </div>
    );
}

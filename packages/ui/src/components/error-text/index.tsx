import classNames from "classnames";
import { ErrorIcon } from "../..//assets/error";
import { Typography, type TypographyProps } from "../typography";

import styles from "./styles.module.css";

type ErrorTextProps = TypographyProps & {
    level?: "error" | "warning";
};

export function ErrorText({
    level = "error",
    children,
    className,
    ...rest
}: ErrorTextProps) {
    return (
        <div className={classNames("root", styles.root, className)}>
            <ErrorIcon
                className={classNames("icon", styles.icon, {
                    [styles[level]]: true,
                })}
            />
            <Typography
                uppercase
                {...rest}
                className={classNames("text", styles.text, {
                    [styles[level]]: true,
                })}
            >
                {children}
            </Typography>
        </div>
    );
}

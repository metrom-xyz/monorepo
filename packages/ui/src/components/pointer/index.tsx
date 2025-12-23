import classNames from "classnames";
import { Typography } from "../typography";
import { Triagle } from "../../assets/triangle";

import styles from "./styles.module.css";

interface PointerProps {
    uppercase?: boolean;
    size?: "xs" | "sm" | "base" | "lg";
    color?: "blue" | "green" | "red";
    anchor?: "left" | "top" | "right" | "bottom";
    text?: string;
    className?: string;
}

export function Pointer({
    uppercase,
    size = "base",
    color = "blue",
    anchor = "left",
    text,
    className,
}: PointerProps) {
    return (
        <div
            className={classNames(styles.root, className, {
                [styles[size]]: true,
                [styles[color]]: true,
            })}
        >
            <Typography
                size={size}
                uppercase={uppercase}
                weight="semibold"
                className={classNames("text", styles.text, {
                    [styles[color]]: true,
                })}
            >
                {text}
            </Typography>
            <Triagle
                className={classNames("arrow", styles.arrow, {
                    [styles[color]]: true,
                    [styles[anchor]]: true,
                })}
            />
        </div>
    );
}

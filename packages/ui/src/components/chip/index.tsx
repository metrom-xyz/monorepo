import { type HTMLAttributes, type ReactNode } from "react";
import classNames from "classnames";
import { Typography } from "../typography";
import { X } from "../../assets";

import styles from "./styles.module.css";

export interface BaseChipsProps {
    size?: "xs" | "sm";
    active?: boolean;
    variant?: "primary" | "secondary";
    children: string | ReactNode;
    className?: string;
    onClose?: React.MouseEventHandler<SVGSVGElement>;
}

export type ChipProps = BaseChipsProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof BaseChipsProps>;

export const Chip = ({
    size = "sm",
    active,
    variant = "primary",
    children,
    onClick,
    onClose,
    className,
    ...rest
}: ChipProps) => {
    function handleOnClose(event: React.MouseEvent<SVGSVGElement>) {
        if (!onClose) return;
        event.stopPropagation();
        onClose(event);
    }

    function handleOnClick(event: React.MouseEvent<HTMLDivElement>) {
        if (!onClick) return;
        onClick(event);
    }

    return (
        <div
            {...rest}
            onClick={handleOnClick}
            className={classNames("root", styles.root, className, {
                [styles[size]]: true,
                [styles.clickable]: !!onClick,
                [styles.active]: active,
                [styles[variant]]: true,
            })}
        >
            {typeof children === "string" ? (
                <Typography size={size} weight="medium">
                    {children}
                </Typography>
            ) : (
                children
            )}
            {onClose && (
                <X
                    onClick={handleOnClose}
                    className={classNames("icon", styles.icon, {
                        [styles[size]]: true,
                        [styles.active]: active,
                    })}
                />
            )}
        </div>
    );
};

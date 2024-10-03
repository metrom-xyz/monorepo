import { toast } from "sonner";
import type { FunctionComponent, ReactNode, SVGProps } from "react";
import { X } from "../../assets/x";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface ToastNotificationProps {
    toastId: string | number;
    title: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    children?: ReactNode;
    variant?: "success" | "fail";
    className?: string;
}

export function ToastNotification({
    toastId,
    icon: Icon,
    title,
    children,
    variant = "success",
    className,
}: ToastNotificationProps) {
    function handleOnDismiss() {
        toast.dismiss(toastId);
    }

    const hasIcon = !!Icon;

    return (
        <div className={classNames("root", styles.root, className)}>
            <div className={classNames("wrapper", styles.wrapper)}>
                <div
                    className={classNames("iconWrapper", styles.iconWrapper, {
                        [styles.error]: variant === "fail",
                    })}
                >
                    {hasIcon && (
                        <Icon
                            className={classNames("icon", styles.icon, {
                                [styles.error]: variant === "fail",
                            })}
                        />
                    )}
                </div>
                <div
                    className={classNames(
                        "contentWrapper",
                        styles.contentWrapper,
                    )}
                >
                    <Typography uppercase light weight="medium" variant="sm">
                        {title}
                    </Typography>
                    {children}
                </div>
            </div>
            <button onClick={handleOnDismiss}>
                <X className={styles.dismissIcon} />
            </button>
        </div>
    );
}

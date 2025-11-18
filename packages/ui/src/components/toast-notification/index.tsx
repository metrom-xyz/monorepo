import {
    toast,
    Toaster as SonnerToast,
    type ToasterProps as SonnerToasterProps,
} from "sonner";
import type { FunctionComponent, ReactNode, SVGProps } from "react";
import { X } from "../../assets/x";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

type ToasterVariant = "success" | "warning" | "fail";

export interface ToastNotificationProps {
    toastId: string | number;
    title: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    children?: ReactNode;
    variant?: ToasterVariant;
    noDismiss?: boolean;
    className?: string;
}

export interface ToasterProps extends SonnerToasterProps {
    variant?: ToasterVariant;
}

export function Toaster({ variant = "success", ...rest }: ToasterProps) {
    return (
        <SonnerToast
            duration={5000}
            visibleToasts={5}
            expand
            position="bottom-right"
            {...rest}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: classNames(styles.toast),
                },
            }}
        />
    );
}

export function ToastNotification({
    toastId,
    icon: Icon,
    title,
    children,
    variant = "success",
    noDismiss = false,
    className,
}: ToastNotificationProps) {
    function handleOnDismiss() {
        toast.dismiss(toastId);
    }

    const hasIcon = !!Icon;

    return (
        <div
            className={classNames("root", styles.root, className, {
                [styles[variant]]: true,
            })}
        >
            <div className={classNames("wrapper", styles.wrapper)}>
                {hasIcon && (
                    <Icon
                        className={classNames("icon", styles.icon, {
                            [styles[variant]]: true,
                        })}
                    />
                )}
                <div
                    className={classNames(
                        "contentWrapper",
                        styles.contentWrapper,
                    )}
                >
                    <Typography
                        uppercase
                        variant="tertiary"
                        weight="medium"
                        size="sm"
                    >
                        {title}
                    </Typography>
                    {children}
                </div>
            </div>
            {!noDismiss && (
                <button onClick={handleOnDismiss}>
                    <X className={styles.dismissIcon} />
                </button>
            )}
        </div>
    );
}

import { ToastNotification, Typography, SpinnerDarkIcon } from "@metrom-xyz/ui";
import { ReactNode } from "react";

interface LoadingNotificationProps {
    toastId: string | number;
    title?: string;
    description?: string;
    action?: ReactNode;
}

export function LoadingNotification({
    toastId,
    title,
    description,
    action,
}: LoadingNotificationProps) {
    return (
        <ToastNotification
            toastId={toastId}
            title={title}
            noDismiss
            icon={SpinnerDarkIcon}
            className="[&>.wrapper>.iconWrapper>.icon]:animate-spin [&>.wrapper]:w-full [&>.wrapper>.contentWrapper]:w-full"
        >
            <div className="flex items-center gap-2">
                <Typography weight="medium">{description}</Typography>
                {action}
            </div>
        </ToastNotification>
    );
}

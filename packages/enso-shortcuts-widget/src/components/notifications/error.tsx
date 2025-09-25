import { ErrorIcon, ToastNotification, Typography } from "@metrom-xyz/ui";
import { ReactNode } from "react";

interface ErrorNotificationProps {
    toastId: string | number;
    title?: string;
    description?: string;
    action?: ReactNode;
}

export function ErrorNotification({
    toastId,
    title,
    description,
    action,
}: ErrorNotificationProps) {
    return (
        <ToastNotification
            toastId={toastId}
            title={title}
            icon={ErrorIcon}
            variant="fail"
            className="[&>.wrapper]:w-full [&>.wrapper>.contentWrapper]:w-full"
        >
            <div className="flex items-center justify-between gap-2">
                <Typography weight="medium">{description}</Typography>
                {action}
            </div>
        </ToastNotification>
    );
}

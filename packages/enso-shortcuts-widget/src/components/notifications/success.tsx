import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { ReactNode } from "react";
import { CircleCheckIcon } from "../../assets/circle-check";

interface SuccessNotificationProps {
    toastId: string | number;
    title?: string;
    description?: string;
    action?: ReactNode;
}

export function SuccessNotification({
    toastId,
    title,
    description,
    action,
}: SuccessNotificationProps) {
    return (
        <ToastNotification
            toastId={toastId}
            title={title}
            noDismiss
            icon={CircleCheckIcon}
            className="[&>.wrapper]:w-full [&>.wrapper>.contentWrapper]:w-full"
        >
            <div className="flex items-center gap-2">
                <Typography weight="medium">{description}</Typography>
                {action}
            </div>
        </ToastNotification>
    );
}

import { useTranslations } from "next-intl";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { SafeLogo } from "@/src/assets/logos/safe";

interface ConnectedNotificationProps {
    toastId: string | number;
}

export function ConnectedNotification({ toastId }: ConnectedNotificationProps) {
    const t = useTranslations("notifications.safe");

    return (
        <ToastNotification toastId={toastId} title={t("title")} icon={SafeLogo}>
            <Typography weight="medium">{t("content")}</Typography>
        </ToastNotification>
    );
}

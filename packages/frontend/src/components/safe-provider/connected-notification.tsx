import { useTranslations } from "next-intl";
import { ToastNotification, Typography } from "@metrom-xyz/ui";

interface ConnectedNotificationProps {
    toastId: string | number;
}

export function ConnectedNotification({ toastId }: ConnectedNotificationProps) {
    const t = useTranslations("notifications.multisig");

    return (
        <ToastNotification
            toastId={toastId}
            title={t("title")}
            // TODO: add icons
            // icon={ClaimReward}
        >
            <Typography weight="medium">{t("content")}</Typography>
        </ToastNotification>
    );
}

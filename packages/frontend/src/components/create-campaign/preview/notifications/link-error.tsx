import { Error } from "@/src/assets/error";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface LinkErrorProps {
    toastId: string | number;
}

export function LinkError({ toastId }: LinkErrorProps) {
    const t = useTranslations("campaignPreview.notifications.linkError");

    return (
        <ToastNotification
            toastId={toastId}
            title={t("title")}
            icon={Error}
            variant="fail"
        >
            <Typography weight="medium">{t("message")}</Typography>
        </ToastNotification>
    );
}

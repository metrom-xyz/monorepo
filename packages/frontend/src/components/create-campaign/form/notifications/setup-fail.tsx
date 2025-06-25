import { Error } from "@/src/assets/error";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface SetupFailProps {
    toastId: string | number;
}

export function SetupFail({ toastId }: SetupFailProps) {
    const t = useTranslations("newCampaign.notifications.setupFail");

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

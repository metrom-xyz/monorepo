import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface SetupSuccessProps {
    toastId: string | number;
}

export function SetupSuccess({ toastId }: SetupSuccessProps) {
    const t = useTranslations("newCampaign.notifications.setupSuccess");

    return (
        <ToastNotification
            toastId={toastId}
            title={t("title")}
            icon={NewCampaignIcon}
            variant="success"
        >
            <Typography weight="medium">{t("message")}</Typography>
        </ToastNotification>
    );
}

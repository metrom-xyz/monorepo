import { TickIcon } from "@/src/assets/tick-icon";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface ImportSuccessProps {
    toastId: string | number;
    message: string;
}

export function ImportSuccess({ toastId, message }: ImportSuccessProps) {
    const t = useTranslations(
        "newCampaign.form.base.restrictions.import.notification",
    );

    return (
        <ToastNotification
            toastId={toastId}
            title={t("success.title")}
            icon={TickIcon}
            variant="success"
        >
            <Typography weight="medium">{message}</Typography>
        </ToastNotification>
    );
}

import { ErrorIcon } from "@/src/assets/error-icon";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface ImportFailProps {
    toastId: string | number;
    message: string;
}

export function ImportFail({ toastId, message }: ImportFailProps) {
    const t = useTranslations(
        "newCampaign.form.base.restrictions.import.notification",
    );

    return (
        <ToastNotification
            toastId={toastId}
            title={t("fail.title")}
            icon={ErrorIcon}
            variant="fail"
        >
            <Typography weight="medium">{message}</Typography>
        </ToastNotification>
    );
}

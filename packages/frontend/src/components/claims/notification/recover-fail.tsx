import { ErrorIcon } from "@/src/assets/error-icon";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface RecoverFailProps {
    toastId: string | number;
}

export function RecoverFail({ toastId }: RecoverFailProps) {
    const t = useTranslations("rewards.reimbursements.notification.fail");

    return (
        <ToastNotification
            toastId={toastId}
            title={t("title")}
            icon={ErrorIcon}
            variant="fail"
        >
            <Typography weight="medium">{t("message")}</Typography>
        </ToastNotification>
    );
}

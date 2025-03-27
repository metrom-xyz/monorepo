import { Error } from "@/src/assets/error";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface ClaimFailProps {
    toastId: string | number;
    message?: string;
}

export function ClaimFail({ toastId, message }: ClaimFailProps) {
    const t = useTranslations("rewards.claims.notification.fail");

    return (
        <ToastNotification
            toastId={toastId}
            title={t("title")}
            icon={Error}
            variant="fail"
        >
            <Typography weight="medium">
                {message ? message : t("message")}
            </Typography>
        </ToastNotification>
    );
}

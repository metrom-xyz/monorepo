import { LinkIcon } from "@/src/assets/link-icon";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface LinkCopiedProps {
    toastId: string | number;
}

export function LinkCopied({ toastId }: LinkCopiedProps) {
    const t = useTranslations("campaignPreview.notifications.linkCopied");

    return (
        <ToastNotification
            toastId={toastId}
            title={t("title")}
            icon={LinkIcon}
            variant="success"
        >
            <Typography weight="medium">{t("message")}</Typography>
        </ToastNotification>
    );
}

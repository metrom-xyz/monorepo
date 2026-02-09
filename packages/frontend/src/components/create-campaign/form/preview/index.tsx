import { useTranslations } from "next-intl";
import { Button, Typography } from "@metrom-xyz/ui";
import { ShareIcon } from "@/src/assets/share-icon";
import { PlusCircleIcon } from "@/src/assets/plus-circle-icon";
import type { CampaignPreviewPayload } from "@/src/types/campaign/common";

import styles from "./styles.module.css";

interface FormPreviewProps {
    payload: CampaignPreviewPayload | null;
}

export function FormPreview({ payload }: FormPreviewProps) {
    const t = useTranslations("newCampaign.formPreview");

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography size="lg" weight="medium" className={styles.title}>
                    {t("preview")}
                </Typography>
                <div className={styles.buttons}>
                    <Button size="sm" disabled icon={ShareIcon}>
                        {t("share")}
                    </Button>
                    <Button size="sm" disabled icon={PlusCircleIcon}>
                        {t("saveAsPreset")}
                    </Button>
                </div>
            </div>
            <div className={styles.content}></div>
        </div>
    );
}

import { TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { CampaignDuration } from "../../campaign-duration";

import styles from "./styles.module.css";

interface DetailsProps {
    from: number;
    to: number;
    protocol: string;
}

export function Details({ from, to, protocol }: DetailsProps) {
    const t = useTranslations("lv2PointsCampaignPage.details");

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.topContent}>
                <TextField
                    boxed
                    size="xl"
                    uppercase
                    label={t("type")}
                    value={t("points")}
                />
                <TextField
                    boxed
                    size="xl"
                    uppercase
                    label={t("createdBy")}
                    value={protocol}
                />
            </div>
            <CampaignDuration from={from} to={to} />
        </div>
    );
}

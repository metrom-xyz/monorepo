import { TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { useMemo } from "react";
import { formatAmount } from "@/src/utils/format";
import type {
    DistributablesCampaign,
    DistributablesType,
} from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface PointsProps {
    campaign: DistributablesCampaign<DistributablesType.FixedPoints>;
    loading: boolean;
}

export function Points({ campaign, loading }: PointsProps) {
    const t = useTranslations("campaignDetails.points");

    const dailyPoints = useMemo(() => {
        if (!campaign.distributables) return 0;

        const hoursDuration = dayjs
            .unix(campaign.to)
            .diff(dayjs.unix(campaign.from), "hours", false);
        const daysDuration = hoursDuration / 24;

        return daysDuration >= 1
            ? campaign.distributables.amount.formatted / daysDuration
            : 0;
    }, [campaign]);

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.summary}>
                <TextField
                    boxed
                    size="xl"
                    label={t("total")}
                    loading={loading || !campaign}
                    value={formatAmount({
                        amount: campaign.distributables.amount.formatted,
                        cutoff: false,
                    })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={t("daily")}
                    loading={loading || !campaign}
                    value={formatAmount({
                        amount: dailyPoints,
                        cutoff: false,
                    })}
                />
            </div>
        </div>
    );
}

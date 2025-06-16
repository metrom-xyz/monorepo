import { useTranslations } from "next-intl";
import styles from "./styles.module.css";
import { TextField, Typography } from "@metrom-xyz/ui";
import { Campaign, Status, TargetType } from "@metrom-xyz/sdk";
import { formatUsdAmount } from "@/src/utils/format";
import { CampaignDuration } from "../../campaign-duration";
import type { TranslationsKeys } from "@/src/types/utils";

interface DetailsProps {
    campaign?: Campaign;
    loading: boolean;
}

const STATUS_TEXT_MAP: Record<
    Status,
    TranslationsKeys<"campaignDetails.details.statusType">
> = {
    upcoming: "upcoming",
    live: "live",
    ended: "ended",
};

export function Details({ campaign, loading }: DetailsProps) {
    const t = useTranslations("campaignDetails.details");

    const detailsLoading = loading || !campaign;

    return (
        <div className={styles.root}>
            <div className={styles.topContent}>
                {campaign?.isTargeting(TargetType.AmmPoolLiquidity) &&
                    campaign.target.pool.usdTvl && (
                        <TextField
                            boxed
                            size="xl"
                            label={t("tvl")}
                            loading={detailsLoading}
                            value={formatUsdAmount({
                                amount: campaign.target.pool.usdTvl,
                                cutoff: false,
                            })}
                        />
                    )}
                <TextField
                    boxed
                    size="xl"
                    label={t("status")}
                    loading={detailsLoading}
                    value={
                        <div className={styles.statusWrapper}>
                            <div className={styles.statusDot}>
                                <div
                                    className={
                                        campaign && styles[campaign.status]
                                    }
                                ></div>
                            </div>
                            <Typography weight="medium" size="xl">
                                {campaign
                                    ? t(
                                          `statusType.${STATUS_TEXT_MAP[campaign.status]}`,
                                      )
                                    : ""}
                            </Typography>
                        </div>
                    }
                />
            </div>
            <CampaignDuration from={campaign?.from} to={campaign?.to} />
        </div>
    );
}

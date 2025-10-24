import { useTranslations } from "next-intl";
import { TextField, Typography } from "@metrom-xyz/ui";
import { Status } from "@metrom-xyz/sdk";
import { formatUsdAmount } from "@/src/utils/format";
import { CampaignDuration } from "../../campaign-duration";
import type { TranslationsKeys } from "@/src/types/utils";
import type { Campaign } from "@/src/types/campaign";
import { CampaignStatusDot } from "../../campaign-status-dot";

import styles from "./styles.module.css";

interface DetailsProps {
    campaign?: Campaign;
    loading: boolean;
}

const STATUS_TEXT_MAP: Record<
    Status,
    TranslationsKeys<"campaignDetails.details.statusType">
> = {
    upcoming: "upcoming",
    active: "live",
    expired: "ended",
};

export function Details({ campaign, loading }: DetailsProps) {
    const t = useTranslations("campaignDetails.details");

    const detailsLoading = loading || !campaign;
    const targetUsdValue = campaign?.getTargetUsdValue();

    return (
        <div className={styles.root}>
            <div className={styles.topContent}>
                {targetUsdValue !== undefined && (
                    <TextField
                        boxed
                        size="xl"
                        label={campaign?.targetValueName || ""}
                        loading={detailsLoading}
                        value={formatUsdAmount({
                            amount: targetUsdValue,
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
                            <CampaignStatusDot status={campaign?.status} />
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

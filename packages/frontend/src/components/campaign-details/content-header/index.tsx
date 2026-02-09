import type { CampaignDetails } from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { InfoTooltip, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import {
    formatAmount,
    formatPercentage,
    formatUsdAmount,
} from "@/src/utils/format";
import {
    CAMPAIGN_TARGET_TO_KIND,
    DistributablesType,
    Status,
} from "@metrom-xyz/sdk";
import { CampaignRewardsPopover } from "../../campaign-rewards-popover";
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";

import styles from "./styles.module.css";

interface ContentHeaderProps {
    campaign: CampaignDetails;
}

export function ContentHeader({ campaign }: ContentHeaderProps) {
    const t = useTranslations("campaignDetails.content");
    const targetValueName = useCampaignTargetValueName({
        kind: CAMPAIGN_TARGET_TO_KIND[campaign.target.type],
    });

    const { status, apr, usdTvl, opportunitiesAmount } = campaign;

    const distributingTokens = campaign?.isDistributing(
        DistributablesType.Tokens,
    );
    const distributingDynamicPoints = campaign?.isDistributing(
        DistributablesType.DynamicPoints,
    );
    const distributingFixedPoints = campaign?.isDistributing(
        DistributablesType.FixedPoints,
    );
    const distributingPoints =
        distributingDynamicPoints || distributingFixedPoints;

    const blueApr = status === Status.Active;
    const orangeApr = status === Status.Active && campaign.hasKpi;

    if (campaign.status === Status.Expired) return;

    return (
        <div className={styles.root}>
            {distributingTokens && (
                <div
                    className={classNames(styles.box, {
                        [styles.blue]: blueApr,
                        [styles.orange]: orangeApr,
                    })}
                >
                    <div className={styles.label}>
                        <Typography
                            size="sm"
                            variant="tertiary"
                            weight="medium"
                            uppercase
                            className={classNames({
                                [styles.lightText]: blueApr || orangeApr,
                            })}
                        >
                            {opportunitiesAmount > 1
                                ? t("aggregatedApr")
                                : t("apr")}
                        </Typography>
                        {opportunitiesAmount > 1 && (
                            <InfoTooltip className={styles.infoTooltip}>
                                <Typography size="sm">
                                    {t("combinedApr")}
                                </Typography>
                            </InfoTooltip>
                        )}
                    </div>
                    <Typography
                        size="xl2"
                        weight="medium"
                        className={classNames({
                            [styles.lightText]: blueApr || orangeApr,
                        })}
                    >
                        {apr === undefined
                            ? "-"
                            : formatPercentage({ percentage: apr })}
                    </Typography>
                </div>
            )}
            {distributingPoints && (
                <>
                    <div className={styles.box}>
                        <Typography
                            size="sm"
                            variant="tertiary"
                            weight="medium"
                            uppercase
                        >
                            {t("dailyPer1k")}
                        </Typography>
                        <Typography size="xl2" weight="medium">
                            {formatUsdAmount({
                                amount: campaign.distributables.dailyPer1k,
                                cutoff: false,
                            })}
                        </Typography>
                    </div>
                    {distributingFixedPoints && (
                        <div className={styles.box}>
                            <Typography
                                size="sm"
                                variant="tertiary"
                                weight="medium"
                                uppercase
                            >
                                {t("totalPoints")}
                            </Typography>
                            <Typography size="xl2" weight="medium">
                                {formatAmount({
                                    amount: campaign.distributables.amount
                                        .formatted,
                                    cutoff: false,
                                })}
                            </Typography>
                        </div>
                    )}
                </>
            )}
            <div className={styles.box}>
                <Typography
                    size="sm"
                    variant="tertiary"
                    weight="medium"
                    uppercase
                >
                    {targetValueName}
                </Typography>
                <Typography size="xl2" weight="medium">
                    {usdTvl === undefined
                        ? "-"
                        : formatUsdAmount({ amount: usdTvl })}
                </Typography>
            </div>
            {distributingTokens && (
                <div className={styles.tokenRewards}>
                    <div className={styles.rewardBox}>
                        <Typography
                            size="sm"
                            variant="tertiary"
                            weight="medium"
                            uppercase
                        >
                            {t("tokens")}
                        </Typography>
                        <div className={styles.tokenIcons}>
                            <CampaignRewardsPopover
                                logoSize="base"
                                symbolSize="xl2"
                                hideUsdValue
                                status={campaign.status}
                                chainId={campaign.chainId}
                                distributables={campaign.distributables}
                            />
                        </div>
                    </div>
                    <div className={styles.rewardBox}>
                        <Typography
                            size="sm"
                            variant="tertiary"
                            weight="medium"
                            uppercase
                        >
                            {t("dailyRewards")}
                        </Typography>
                        <Typography size="xl2" weight="medium">
                            {formatUsdAmount({
                                amount: campaign.distributables.dailyUsd,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.rewardBox}>
                        <Typography
                            size="sm"
                            variant="tertiary"
                            weight="medium"
                            uppercase
                        >
                            {t("totalValue")}
                        </Typography>
                        <Typography size="xl2" weight="medium">
                            {formatUsdAmount({
                                amount: campaign.distributables.amountUsdValue,
                            })}
                        </Typography>
                    </div>
                </div>
            )}
        </div>
    );
}

export function SkeletonContentHeader() {
    return (
        <div className={styles.root}>
            <div className={classNames(styles.box, styles.loading)}></div>
            <div className={classNames(styles.box, styles.loading)}></div>
            <div className={classNames(styles.box, styles.loading)}></div>
        </div>
    );
}

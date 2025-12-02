import type { Campaign } from "@/src/types/campaign";
import { AprInfoTooltip } from "../../apr-info-tooltip";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import {
    formatAmount,
    formatPercentage,
    formatUsdAmount,
} from "@/src/utils/format";
import { DistributablesType, Status, TargetType } from "@metrom-xyz/sdk";
import { CampaignRewardsPopover } from "../../campaign-rewards-popover";
import { CampaignWeighting } from "../../campaign-weighting";

import styles from "./styles.module.css";

interface ContentHeaderProps {
    campaign: Campaign;
}

export function ContentHeader({ campaign }: ContentHeaderProps) {
    const t = useTranslations("campaignDetails.content");

    const { status, apr, usdTvl, specification } = campaign;

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
    const ammPoolCampaign = campaign?.isTargeting(TargetType.AmmPoolLiquidity);

    const blueApr = status === Status.Active;
    const orangeApr = status === Status.Active && specification?.kpi;

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
                            {t("apr")}
                        </Typography>
                        <AprInfoTooltip
                            campaign={campaign}
                            className={classNames({
                                [styles.infoIcon]: blueApr || orangeApr,
                            })}
                        />
                    </div>
                    <Typography
                        size="xl3"
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
                        <Typography size="xl3" weight="medium">
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
                            <Typography size="xl3" weight="medium">
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
                    {t("tvl")}
                </Typography>
                <Typography size="xl3" weight="medium">
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
                                logoSize="lg"
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
                        <Typography size="xl3" weight="medium">
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
                        <Typography size="xl3" weight="medium">
                            {formatUsdAmount({
                                amount: campaign.distributables.amountUsdValue,
                            })}
                        </Typography>
                    </div>
                </div>
            )}
            {specification && specification.weighting && ammPoolCampaign && (
                <div className={styles.box}>
                    <Typography
                        size="sm"
                        variant="tertiary"
                        weight="medium"
                        uppercase
                    >
                        {t("rewardRatio")}
                    </Typography>
                    <CampaignWeighting
                        pool={campaign.target.pool}
                        specification={specification}
                    />
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

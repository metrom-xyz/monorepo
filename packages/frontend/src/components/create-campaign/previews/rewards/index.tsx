import classNames from "classnames";
import { FormStepPreview } from "../../form-step-preview";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import {
    formatAmount,
    formatPercentage,
    formatUsdAmount,
} from "@/src/utils/format";
import { useFormSteps } from "@/src/context/form-steps";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
    DistributablesType,
    type AmmPool,
    type Restrictions,
    type Weighting,
} from "@metrom-xyz/sdk";
import type {
    CampaignPayloadDistributables,
    CampaignPayloadFixedDistribution,
} from "@/src/types/campaign/common";
import type { Dayjs } from "dayjs";
import { RemoteLogo } from "@/src/components/remote-logo";
import { AddressRestrictions } from "./address-restrictions";

import styles from "./styles.module.css";

interface RewardsProps {
    chainId?: number;
    apr?: number;
    loadingApr?: boolean;
    completed?: boolean;
    startDate?: Dayjs;
    endDate?: Dayjs;
    distributables?: CampaignPayloadDistributables;
    pool?: AmmPool;
    fixedDistribution?: CampaignPayloadFixedDistribution;
    weighting?: Weighting;
    restrictions?: Restrictions;
}

export function Rewards({
    chainId,
    apr,
    loadingApr,
    completed,
    startDate,
    endDate,
    distributables,
    pool,
    fixedDistribution,
    weighting,
    restrictions,
}: RewardsProps) {
    const t = useTranslations("newCampaign.formPreview");
    const { errors } = useFormSteps();

    const totalUsd = useMemo(() => {
        if (
            !distributables ||
            distributables.type !== DistributablesType.Tokens ||
            !distributables.tokens
        )
            return 0;

        let total = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return 0;
            total += reward.amount.usdValue;
        }

        return total;
    }, [distributables]);

    const dailyUsd = useMemo(() => {
        if (!endDate || !startDate || !totalUsd) return 0;

        const hoursDuration = endDate.diff(startDate, "hours", false);
        const daysDuration = hoursDuration / 24;

        return daysDuration >= 1 ? totalUsd / daysDuration : 0;
    }, [startDate, endDate, totalUsd]);

    const derivedApr = fixedDistribution?.apr || apr;

    return (
        <FormStepPreview
            title={
                <div className={styles.header}>
                    <Typography size="xs" weight="semibold" uppercase>
                        {t("rewards")}
                    </Typography>
                    <div
                        className={classNames(styles.aprChip, {
                            [styles.noApr]: derivedApr === undefined,
                        })}
                    >
                        {loadingApr ? (
                            <Skeleton size="xs" className={styles.loadingApr} />
                        ) : (
                            <Typography size="xs" weight="medium">
                                {t("apr", {
                                    apr:
                                        derivedApr !== undefined
                                            ? formatPercentage({
                                                  percentage: derivedApr,
                                              })
                                            : "-",
                                })}
                            </Typography>
                        )}
                    </div>
                </div>
            }
            completed={completed}
            error={!!errors.rewards}
        >
            <div className={styles.distributables}>
                <Typography size="xs" weight="medium" variant="tertiary">
                    {t("dailyAndTot", {
                        dailyUsd: formatUsdAmount({ amount: dailyUsd }),
                        totalUsd: formatUsdAmount({ amount: totalUsd }),
                    })}
                </Typography>
                <div className={styles.tokens}>
                    {distributables &&
                        distributables.type === DistributablesType.Tokens &&
                        distributables.tokens
                            ?.sort(
                                (a, b) => b.amount.usdValue - a.amount.usdValue,
                            )
                            .map(({ token, amount }) => {
                                return (
                                    <div
                                        key={token.address}
                                        className={styles.token}
                                    >
                                        <div className={styles.tokenName}>
                                            <RemoteLogo
                                                size="xxs"
                                                address={token.address}
                                                chain={chainId}
                                            />
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                            >
                                                {token.symbol}
                                            </Typography>
                                        </div>
                                        <div className={styles.amount}>
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                            >
                                                {formatAmount({
                                                    amount: amount.formatted,
                                                })}
                                            </Typography>
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                variant="tertiary"
                                            >
                                                {`(${formatUsdAmount({ amount: amount.usdValue })})`}
                                            </Typography>
                                        </div>
                                    </div>
                                );
                            })}
                </div>
            </div>
            {pool && weighting && (
                <div className={styles.weighting}>
                    <Typography size="xs" weight="medium" variant="tertiary">
                        {t("rewardRatio")}
                    </Typography>
                    <div className={styles.weights}>
                        <div className={styles.weight}>
                            <Typography size="sm" weight="medium">
                                {formatPercentage({
                                    percentage: weighting.token0,
                                })}
                            </Typography>
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                            >
                                {pool.tokens[0].symbol}
                            </Typography>
                        </div>
                        <div className={styles.weight}>
                            <Typography size="sm" weight="medium">
                                {formatPercentage({
                                    percentage: weighting.token1,
                                })}
                            </Typography>
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                            >
                                {pool.tokens[1].symbol}
                            </Typography>
                        </div>
                        <div className={styles.weight}>
                            <Typography size="sm" weight="medium">
                                {formatPercentage({
                                    percentage: weighting.liquidity,
                                })}
                            </Typography>
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                            >
                                {t("fees")}
                            </Typography>
                        </div>
                    </div>
                </div>
            )}
            {restrictions && restrictions.list.length > 0 && (
                <AddressRestrictions restrictions={restrictions} />
            )}
        </FormStepPreview>
    );
}

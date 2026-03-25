import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import {
    type CampaignPayloadErrors,
    type BaseCampaignPayloadPart,
    type CampaignPayloadTokenDistributables,
} from "@/src/types/campaign";
import type { LocalizedMessage } from "@/src/types/utils";
import {
    Button,
    ErrorText,
    Skeleton,
    Toggle,
    Typography,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatUsdAmount } from "@/src/utils/format";
import {
    CampaignKind,
    KpiMetric,
    SpecificationDistributionType,
    type KpiDistributionSpecification,
} from "@metrom-xyz/sdk";
import { usePrevious } from "react-use";
import { KpiSimulationChart } from "../../../kpi-simulation-chart";
import { GoalInputs } from "./goal-inputs";
import { InfoMessage } from "@/src/components/info-message";
import type { Dayjs } from "dayjs";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";

import styles from "./styles.module.css";

interface KpiStepProps {
    disabled?: boolean;
    kind?: CampaignKind;
    loadingUsdTvl?: boolean;
    usdTvl?: number;
    distributables?: CampaignPayloadTokenDistributables;
    startDate?: Dayjs;
    endDate?: Dayjs;
    distribution?: KpiDistributionSpecification;
    onKpiChange: (value: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.base.kpi">;

// TODO: make KPI step work with liquityv2 campaigns
export function KpiStep({
    disabled,
    kind,
    loadingUsdTvl,
    usdTvl,
    distributables,
    startDate,
    endDate,
    distribution,
    onKpiChange,
    onError,
}: KpiStepProps) {
    const t = useTranslations("newCampaign.form.base.kpi");
    const targetValueName = useCampaignTargetValueName({ kind });

    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [error, setError] = useState<ErrorMessage>("");
    const [warning, setWarning] = useState<ErrorMessage>("");

    const [minimumPayoutPercentage, setMinimumPayoutPercentage] =
        useState<number>(distribution?.minimumPayoutPercentage || 0);
    const [lowerUsdTargetRaw, setLowerUsdTargetRaw] = useState<
        number | undefined
    >(distribution?.goal.lowerUsdTarget);
    const [upperUsdTargetRaw, setUpperUsdTargetRaw] = useState<
        number | undefined
    >(distribution?.goal.upperUsdTarget);

    const prevDistribution = usePrevious(distribution);
    const { id: chainId } = useChainWithType();

    const totalRewardsUsdAmount = useMemo(() => {
        if (!distributables || !distributables.tokens) return 0;
        let total = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return 0;
            total += reward.amount.usdValue;
        }
        return total;
    }, [distributables]);

    const unsavedChanges = useMemo(() => {
        if (!prevDistribution) return true;

        const {
            minimumPayoutPercentage: prevMinPayout = 0,
            goal: {
                lowerUsdTarget: prevLowerTarget,
                upperUsdTarget: prevUpperTarget,
            },
        } = prevDistribution;

        return (
            prevMinPayout !== minimumPayoutPercentage ||
            prevLowerTarget !== lowerUsdTargetRaw ||
            prevUpperTarget !== upperUsdTargetRaw
        );
    }, [
        lowerUsdTargetRaw,
        minimumPayoutPercentage,
        prevDistribution,
        upperUsdTargetRaw,
    ]);

    const newKpiDistribution: KpiDistributionSpecification | undefined =
        lowerUsdTargetRaw !== undefined && upperUsdTargetRaw !== undefined
            ? {
                  type: SpecificationDistributionType.Kpi,
                  goal: {
                      metric: KpiMetric.RangePoolTvl,
                      lowerUsdTarget: lowerUsdTargetRaw,
                      upperUsdTarget: upperUsdTargetRaw,
                  },
                  minimumPayoutPercentage,
              }
            : undefined;

    useEffect(() => {
        setEnabled(false);
    }, [chainId]);

    // this hooks is used to disable and close the step when
    // the kpi specification gets disabled, after the campaign creation
    useEffect(() => {
        if (enabled && !!prevDistribution && !distribution) setEnabled(false);
    }, [enabled, distribution, prevDistribution]);

    useEffect(() => {
        if (enabled) return;
        if (distribution) onKpiChange({ distribution: undefined });

        setMinimumPayoutPercentage(0);
        setLowerUsdTargetRaw(undefined);
        setUpperUsdTargetRaw(undefined);
        setError("");
    }, [enabled, distribution, onKpiChange]);

    useEffect(() => {
        if (
            lowerUsdTargetRaw === undefined &&
            upperUsdTargetRaw === undefined
        ) {
            setError("");
            return;
        }

        if (
            (lowerUsdTargetRaw === undefined && upperUsdTargetRaw) ||
            (upperUsdTargetRaw === undefined && lowerUsdTargetRaw)
        ) {
            setError("errors.missing");
            return;
        }

        if (
            lowerUsdTargetRaw !== undefined &&
            upperUsdTargetRaw !== undefined &&
            lowerUsdTargetRaw >= upperUsdTargetRaw
        )
            setError("errors.malformed");
        else setError("");
    }, [lowerUsdTargetRaw, upperUsdTargetRaw]);

    useEffect(() => {
        if (enabled && !open && unsavedChanges)
            setWarning("warnings.notApplied");
        else setWarning("");
    }, [enabled, open, unsavedChanges]);

    useEffect(() => {
        onError({
            distribution: !!error || (enabled && !distribution),
        });
    }, [error, enabled, distribution, onError]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    // TODO: avoid resetting when the KPI is enabled for points.
    // This hook is used to reset and disable the KPI when changing reward type.
    useEffect(() => {
        onKpiChange({ distribution: undefined });
        setMinimumPayoutPercentage(0);
        setLowerUsdTargetRaw(undefined);
        setUpperUsdTargetRaw(undefined);
        setEnabled(false);
        setError("");
    }, [distributables?.type, onKpiChange]);

    function handleToggleOnClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        setOpen((open) => !open);
    }

    const handleOnApply = useCallback(() => {
        if (lowerUsdTargetRaw === undefined || upperUsdTargetRaw === undefined)
            return;

        const distribution: KpiDistributionSpecification = {
            type: SpecificationDistributionType.Kpi,
            goal: {
                metric: KpiMetric.RangePoolTvl,
                lowerUsdTarget: lowerUsdTargetRaw,
                upperUsdTarget: upperUsdTargetRaw,
            },
        };

        if (minimumPayoutPercentage)
            distribution.minimumPayoutPercentage = minimumPayoutPercentage;

        setOpen(false);
        onKpiChange({ distribution });
    }, [
        lowerUsdTargetRaw,
        minimumPayoutPercentage,
        onKpiChange,
        upperUsdTargetRaw,
    ]);

    return (
        <Step
            disabled={disabled}
            completed={enabled}
            open={open}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <div className={styles.previewTextWrapper}>
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("title")}
                            </Typography>
                            <ErrorText
                                size="xs"
                                weight="medium"
                                level={error ? "error" : "warning"}
                            >
                                {error ? t(error) : warning ? t(warning) : null}
                            </ErrorText>
                        </div>
                        <Toggle
                            tabIndex={-1}
                            size="lg"
                            checked={enabled}
                            onClick={handleToggleOnClick}
                        />
                    </div>
                }
                decorator={false}
                disabled={!enabled}
            >
                <div className={styles.tvlWrapper}>
                    <Typography
                        uppercase
                        weight="medium"
                        variant="tertiary"
                        size="sm"
                    >
                        {t("currentTarget", { targetValueName })}
                    </Typography>
                    {loadingUsdTvl ? (
                        <Skeleton width={50} size="sm" />
                    ) : (
                        <Typography weight="medium" size="sm">
                            {formatUsdAmount({ amount: usdTvl })}
                        </Typography>
                    )}
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <InfoMessage
                        text={t.rich("infoMessage", {
                            targetValueName,
                            bold: (chunks) => (
                                <span className={styles.boldText}>
                                    {chunks}
                                </span>
                            ),
                        })}
                        link="https://docs.metrom.xyz/creating-a-campaign/kpi-campaign"
                        linkText={t("readMore")}
                    />
                    <GoalInputs
                        kind={kind}
                        enabled={enabled}
                        kpiDistribution={newKpiDistribution}
                        error={!!error}
                        onLowerUsdTargetChange={setLowerUsdTargetRaw}
                        onUpperUsdTargetChange={setUpperUsdTargetRaw}
                        onMinimumPayoutPercentageChange={
                            setMinimumPayoutPercentage
                        }
                    />
                    <div className={styles.chartWrapper}>
                        <div className={styles.simulationTitleWrapper}>
                            <Typography
                                uppercase
                                weight="medium"
                                variant="tertiary"
                                size="xs"
                            >
                                {t("simulation.title")}
                            </Typography>
                            <Typography
                                weight="medium"
                                variant="tertiary"
                                size="xs"
                            >
                                {t("simulation.description", {
                                    targetValueName,
                                })}
                            </Typography>
                        </div>
                        <KpiSimulationChart
                            tooltipSize="xs"
                            targetValueName={targetValueName}
                            lowerUsdTarget={lowerUsdTargetRaw}
                            upperUsdTarget={upperUsdTargetRaw}
                            totalRewardsUsd={totalRewardsUsdAmount}
                            campaignDurationSeconds={
                                startDate && endDate
                                    ? endDate.unix() - startDate.unix()
                                    : 1
                            }
                            minimumPayoutPercentage={minimumPayoutPercentage}
                            targetUsdValue={usdTvl}
                            error={!!error}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={
                            !unsavedChanges ||
                            upperUsdTargetRaw === undefined ||
                            lowerUsdTargetRaw === undefined ||
                            !!error
                        }
                        onClick={handleOnApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}

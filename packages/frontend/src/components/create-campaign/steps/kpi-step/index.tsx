import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import {
    type CampaignPayloadErrors,
    type BaseCampaignPayloadPart,
    type CampaignPayloadTokenDistributables,
} from "@/src/types/campaign";
import type { LocalizedMessage } from "@/src/types/utils";
import { Button, ErrorText, Switch, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatUsdAmount } from "@/src/utils/format";
import {
    CampaignKind,
    KpiMetric,
    type KpiSpecification,
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
    usdTvl?: number;
    distributables?: CampaignPayloadTokenDistributables;
    startDate?: Dayjs;
    endDate?: Dayjs;
    kpiSpecification?: KpiSpecification;
    onKpiChange: (value: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.base.kpi">;

// TODO: make KPI step work with liquityv2 campaigns
export function KpiStep({
    disabled,
    kind,
    usdTvl,
    distributables,
    startDate,
    endDate,
    kpiSpecification,
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
        useState<number>(kpiSpecification?.minimumPayoutPercentage || 0);
    const [lowerUsdTargetRaw, setLowerUsdTargetRaw] = useState<
        number | undefined
    >(kpiSpecification?.goal.lowerUsdTarget);
    const [upperUsdTargetRaw, setUpperUsdTargetRaw] = useState<
        number | undefined
    >(kpiSpecification?.goal.upperUsdTarget);

    const prevKpiSpecification = usePrevious(kpiSpecification);
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
        if (!prevKpiSpecification) return true;

        const {
            minimumPayoutPercentage: prevMinPayout = 0,
            goal: {
                lowerUsdTarget: prevLowerTarget,
                upperUsdTarget: prevUpperTarget,
            },
        } = prevKpiSpecification;

        return (
            prevMinPayout !== minimumPayoutPercentage ||
            prevLowerTarget !== lowerUsdTargetRaw ||
            prevUpperTarget !== upperUsdTargetRaw
        );
    }, [
        lowerUsdTargetRaw,
        minimumPayoutPercentage,
        prevKpiSpecification,
        upperUsdTargetRaw,
    ]);

    const newKpiSpecification: KpiSpecification | undefined =
        lowerUsdTargetRaw !== undefined && upperUsdTargetRaw !== undefined
            ? {
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
        if (enabled && !!prevKpiSpecification && !kpiSpecification)
            setEnabled(false);
    }, [enabled, kpiSpecification, prevKpiSpecification]);

    useEffect(() => {
        if (enabled) return;
        if (kpiSpecification) onKpiChange({ kpiSpecification: undefined });

        setMinimumPayoutPercentage(0);
        setLowerUsdTargetRaw(undefined);
        setUpperUsdTargetRaw(undefined);
        setError("");
    }, [enabled, kpiSpecification, onKpiChange]);

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
            kpiSpecification: !!error || (enabled && !kpiSpecification),
        });
    }, [error, enabled, kpiSpecification, onError]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    // TODO: avoid resetting when the KPI is enabled for points.
    // This hook is used to reset and disable the KPI when changing reward type.
    useEffect(() => {
        onKpiChange({ kpiSpecification: undefined });
        setMinimumPayoutPercentage(0);
        setLowerUsdTargetRaw(undefined);
        setUpperUsdTargetRaw(undefined);
        setEnabled(false);
        setError("");
    }, [distributables?.type, onKpiChange]);

    function handleSwitchOnClick(
        _: boolean,
        event:
            | React.MouseEvent<HTMLButtonElement>
            | React.KeyboardEvent<HTMLButtonElement>,
    ) {
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

        const kpiSpecification: KpiSpecification = {
            goal: {
                metric: KpiMetric.RangePoolTvl,
                lowerUsdTarget: lowerUsdTargetRaw,
                upperUsdTarget: upperUsdTargetRaw,
            },
        };

        if (minimumPayoutPercentage)
            kpiSpecification.minimumPayoutPercentage = minimumPayoutPercentage;

        setOpen(false);
        onKpiChange({ kpiSpecification });
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
                        <Switch
                            tabIndex={-1}
                            size="lg"
                            checked={enabled}
                            onClick={handleSwitchOnClick}
                        />
                    </div>
                }
                decorator={false}
                disabled={!enabled}
            >
                <div className={styles.tvlWrapper}>
                    <Typography uppercase weight="medium" light size="sm">
                        {t("currentTarget", { targetValueName })}
                    </Typography>
                    <Typography weight="medium" size="sm">
                        {formatUsdAmount({ amount: usdTvl })}
                    </Typography>
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
                        kpiSpecification={newKpiSpecification}
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
                                light
                                size="xs"
                                className={styles.simulationText}
                            >
                                {t("simulation.title")}
                            </Typography>
                            <Typography
                                weight="medium"
                                light
                                size="xs"
                                className={styles.simulationText}
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

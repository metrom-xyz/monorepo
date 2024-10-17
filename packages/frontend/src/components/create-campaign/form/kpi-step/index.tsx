import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import {
    Button,
    ErrorText,
    Switch,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatUsdAmount } from "@/src/utils/format";
import classNames from "classnames";
import { KpiMetric, type KpiSpecification } from "@metrom-xyz/sdk";
import { usePrevious } from "react-use";
import { KpiSimulationChart } from "../../../kpi-simulation-chart";
import { GoalInputs } from "./goal-inputs";

import styles from "./styles.module.css";

interface KpiStepProps {
    disabled?: boolean;
    pool?: CampaignPayload["pool"];
    rewards?: CampaignPayload["rewards"];
    kpiSpecification?: CampaignPayload["kpiSpecification"];
    onKpiChange: (amm: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

export function KpiStep({
    disabled,
    pool,
    rewards,
    kpiSpecification,
    onKpiChange,
    onError,
}: KpiStepProps) {
    const t = useTranslations("newCampaign.form.kpi");
    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [boundsError, setBoundsError] = useState("");

    const [minimumPayoutPercentage, setMinimumPayoutPercentage] =
        useState<number>(0);
    const [lowerUsdTargetRaw, setLowerUsdTargetRaw] = useState<number>();
    const [upperUsdTargetRaw, setUpperUsdTargetRaw] = useState<number>();

    const prevKpiSpecification = usePrevious(kpiSpecification);

    const totalRewardsUsdAmount = useMemo(() => {
        if (!rewards) return 0;
        let total = 0;
        for (const reward of rewards) {
            if (!reward.amount.usdValue) return 0;
            total += reward.amount.usdValue;
        }
        return total;
    }, [rewards]);

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
        setBoundsError("");
    }, [enabled, kpiSpecification, onKpiChange]);

    useEffect(() => {
        if (
            lowerUsdTargetRaw === undefined &&
            upperUsdTargetRaw === undefined
        ) {
            setBoundsError("");
            return;
        }

        if (
            (lowerUsdTargetRaw === undefined && upperUsdTargetRaw) ||
            (upperUsdTargetRaw === undefined && lowerUsdTargetRaw)
        ) {
            setBoundsError("errors.missing");
            return;
        }

        if (
            lowerUsdTargetRaw !== undefined &&
            upperUsdTargetRaw !== undefined &&
            lowerUsdTargetRaw >= upperUsdTargetRaw
        )
            setBoundsError("errors.malformed");
        else setBoundsError("");
    }, [lowerUsdTargetRaw, upperUsdTargetRaw]);

    useEffect(() => {
        onError({
            kpiSpecification: !!boundsError || (enabled && !kpiSpecification),
        });
    }, [boundsError, enabled, kpiSpecification, onError]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    function handleSwitchOnClick() {
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
            error={!!boundsError}
            completed={enabled}
            open={open}
            onPreviewClick={handleStepOnClick}
            className={styles.step}
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
                                variant="xs"
                                weight="medium"
                                className={classNames(styles.error, {
                                    [styles.errorVisible]: !!boundsError,
                                })}
                            >
                                {boundsError && t(boundsError)}
                            </ErrorText>
                        </div>
                        <Switch
                            size="big"
                            checked={enabled}
                            onClick={handleSwitchOnClick}
                        />
                    </div>
                }
                decorator={false}
                className={{
                    root: !enabled ? styles.previewDisabled : "",
                }}
            >
                <div className={styles.tvlWrapper}>
                    <Typography uppercase weight="medium" light variant="sm">
                        {t("currentTvl")}
                    </Typography>
                    <Typography weight="medium" variant="sm">
                        {formatUsdAmount(pool?.usdTvl)}
                    </Typography>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <GoalInputs
                        kpiSpecification={kpiSpecification}
                        error={!!boundsError}
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
                                variant="xs"
                            >
                                {t("simulation.title")}
                            </Typography>
                            <Typography weight="medium" light variant="xs">
                                {t("simulation.description")}
                            </Typography>
                        </div>
                        <KpiSimulationChart
                            lowerUsdTarget={lowerUsdTargetRaw}
                            upperUsdTarget={upperUsdTargetRaw}
                            totalRewardsUsd={totalRewardsUsdAmount}
                            minimumPayoutPercentage={minimumPayoutPercentage}
                            poolUsdTvl={pool?.usdTvl}
                            error={!!boundsError}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={
                            !unsavedChanges ||
                            upperUsdTargetRaw === undefined ||
                            lowerUsdTargetRaw === undefined ||
                            !!boundsError
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

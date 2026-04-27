import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FunctionComponent,
} from "react";
import type {
    BaseCampaignPayload,
    BaseCampaignPayloadPart,
    CampaignPayloadKpiDistribution,
} from "@/src/types/campaign/common";
import { FormStepSection } from "../../form-step-section";
import { Button, Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { formatUsdAmount } from "@/src/utils/format";
import { useFormSteps } from "@/src/context/form-steps";
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";
import type { SVGIcon } from "@/src/types/common";
import { KpiPresets, KpiPresetType } from "./presets";
import type { TranslationsKeys } from "@/src/types/utils";
import { TraditionalRewardIcon } from "@/src/assets/traditional-reward-icon";
import { CappedRewardRateIcon } from "@/src/assets/capped-reward-rate-icon";
import { IncreasingAprIcon } from "@/src/assets/increasing-apr-icon";
import { CustomRewardRateIcon } from "@/src/assets/custom-reward-rate-icon";
import { BoldText } from "@/src/components/bold-text";
import { KpiGoalInputs } from "../../inputs/kpi-goal-inputs";
import { FormStepId } from "@/src/types/form";
import { DistributablesType, KpiMetric } from "@metrom-xyz/sdk";
import { kpisEqual, kpiSpecificationCompleted } from "@/src/utils/form";
import { KpiSimulationChart } from "@/src/components/kpi-simulation-chart";

import styles from "./styles.module.css";

interface CampaignkPIStepProps {
    payload: BaseCampaignPayload;
    loadingTargetUsdValue?: boolean;
    targetUsdValue?: number;
    disabled?: boolean;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

interface KpiPreset {
    icon: FunctionComponent<SVGIcon>;
    title: TranslationsKeys<"newCampaign.form.kpi.presets">;
    description: TranslationsKeys<"newCampaign.form.kpi.presets">;
    setLowerBound: (targetUsdValue: number) => number | undefined;
    setUpperBound: (targetUsdValue: number) => number | undefined;
    minimumPayoutPercentage?: number;
}

export const KPI_PRESETS: Record<KpiPresetType, KpiPreset> = {
    [KpiPresetType.TraditionalReward]: {
        icon: TraditionalRewardIcon,
        title: "traditionalReward.title",
        description: "traditionalReward.description",
        setLowerBound: () => 0,
        setUpperBound: (targetUsdValue) => targetUsdValue * 2,
        minimumPayoutPercentage: 60,
    },
    [KpiPresetType.CappedRewardRate]: {
        icon: CappedRewardRateIcon,
        title: "cappedRewardRate.title",
        description: "cappedRewardRate.description",
        setLowerBound: () => 0,
        setUpperBound: (targetUsdValue) => targetUsdValue * 2,
        minimumPayoutPercentage: 0,
    },
    [KpiPresetType.IncreasingApr]: {
        icon: IncreasingAprIcon,
        title: "increasingApr.title",
        description: "increasingApr.description",
        setLowerBound: (targetUsdValue) => targetUsdValue / 2,
        setUpperBound: (targetUsdValue) => targetUsdValue * 1.5,
        minimumPayoutPercentage: 0,
    },
    [KpiPresetType.CustomRewardRate]: {
        icon: CustomRewardRateIcon,
        title: "customReward.title",
        description: "customReward.description",
        setLowerBound: () => undefined,
        setUpperBound: () => undefined,
        minimumPayoutPercentage: undefined,
    },
};

interface KpiPayload {
    kpiDistribution?: CampaignPayloadKpiDistribution;
}

export function CampaignKpiStep({
    payload,
    loadingTargetUsdValue,
    targetUsdValue,
    disabled,
    onApply,
}: CampaignkPIStepProps) {
    const [open, setOpen] = useState(false);
    const [applied, setApplied] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const [preset, setPreset] = useState<KpiPresetType | undefined>();
    const [popover, setPopover] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLDivElement | null>(
        null,
    );
    const [kpiPayload, setKpiPayload] = useState<KpiPayload>({
        kpiDistribution: payload.kpiDistribution || {
            goal: {
                metric: KpiMetric.RangePoolTvl,
                upperUsdTarget: undefined,
                lowerUsdTarget: undefined,
            },
            minimumPayoutPercentage: undefined,
        },
    });

    const t = useTranslations("newCampaign.form.kpi");
    const popoverRef = useRef<HTMLDivElement>(null);
    const { errors, activeStepId, updateUnsaved } = useFormSteps();
    const targetValueName = useCampaignTargetValueName({ kind: payload.kind });

    const totalRewardsUsdAmount = useMemo(() => {
        if (
            !payload.distributables ||
            payload.distributables.type !== DistributablesType.Tokens ||
            !payload.distributables.tokens
        )
            return 0;
        let total = 0;
        for (const reward of payload.distributables.tokens) {
            if (!reward.amount.usdValue) return 0;
            total += reward.amount.usdValue;
        }
        return total;
    }, [payload.distributables]);

    const campaignDurationSeconds =
        payload.startDate && payload.endDate
            ? payload.endDate.unix() - payload.startDate.unix()
            : 1;

    const unsavedChanges = useMemo(() => {
        if (!payload.kpiDistribution)
            return kpiSpecificationCompleted(kpiPayload);

        return !kpisEqual(payload, kpiPayload);
    }, [payload, kpiPayload]);

    const applyDisabled =
        !!errors.kpi ||
        !unsavedChanges ||
        !kpiSpecificationCompleted(kpiPayload);

    const completed =
        !errors.kpi && !unsavedChanges && kpiSpecificationCompleted(kpiPayload);

    const internalDisabled = disabled || !!payload.fixedDistribution;

    useEffect(() => {
        if (targetUsdValue === undefined || !preset) return;

        const { setLowerBound, setUpperBound, minimumPayoutPercentage } =
            KPI_PRESETS[preset];

        setKpiPayload({
            kpiDistribution: {
                goal: {
                    metric: KpiMetric.RangePoolTvl,
                    lowerUsdTarget: setLowerBound(Math.floor(targetUsdValue)),
                    upperUsdTarget: setUpperBound(Math.floor(targetUsdValue)),
                },
                minimumPayoutPercentage,
            },
        });
    }, [targetUsdValue, preset]);

    useEffect(() => {
        if (applied || completed || internalDisabled) return;
        setOpen(activeStepId === FormStepId.Kpi);
    }, [applied, completed, internalDisabled, activeStepId]);

    useEffect(() => {
        updateUnsaved({ kpi: unsavedChanges });
    }, [unsavedChanges, updateUnsaved]);

    useEffect(() => {
        if (completed || internalDisabled || skipped) return;
        if (errors.kpi || unsavedChanges) {
            setOpen(true);
            return;
        }
    }, [skipped, completed, internalDisabled, unsavedChanges, errors.kpi]);

    function handlePopoverOpen() {
        setPopover(true);
    }

    function handlePopoverClose() {
        setPopover(false);
    }

    const handleOnApply = useCallback(() => {
        onApply(kpiPayload, FormStepId.Kpi);
        setApplied(true);
        setSkipped(false);
        setOpen(false);
    }, [kpiPayload, onApply]);

    const handleOnSkip = useCallback(() => {
        onApply({ kpiDistribution: undefined }, FormStepId.Kpi);
        setApplied(true);
        setSkipped(true);
        setPreset(undefined);
        setKpiPayload({ kpiDistribution: undefined });
        setOpen(false);
    }, [onApply]);

    function handleUpperUsdTargetOnChange(value?: number) {
        setKpiPayload((prev) => ({
            kpiDistribution: {
                ...prev.kpiDistribution,
                goal: {
                    ...prev.kpiDistribution?.goal,
                    upperUsdTarget: value,
                },
            },
        }));
    }

    function handleLowerUsdTargetOnChange(value?: number) {
        setKpiPayload((prev) => ({
            kpiDistribution: {
                ...prev.kpiDistribution,
                goal: {
                    ...prev.kpiDistribution?.goal,
                    lowerUsdTarget: value,
                },
            },
        }));
    }

    function handleMinumumPayoutPercentageOnChange(value?: number) {
        setKpiPayload((prev) => ({
            kpiDistribution: {
                ...prev.kpiDistribution,
                minimumPayoutPercentage: value,
            },
        }));
    }

    return (
        <>
            {!!payload.fixedDistribution && (
                <Popover
                    ref={popoverRef}
                    open={popover}
                    anchor={popoverAnchor}
                    placement="top"
                    onOpenChange={setPopover}
                    margin={6}
                >
                    <Typography size="xs">
                        {t("fixedDistributionActive")}
                    </Typography>
                </Popover>
            )}
            <div
                ref={setPopoverAnchor}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <FormStep
                    title={t("title")}
                    open={open}
                    optional
                    skipped={skipped}
                    disabled={internalDisabled}
                    completed={completed}
                    error={errors.kpi}
                    warning={
                        !errors.kpi && !open && unsavedChanges
                            ? t("notSaved")
                            : undefined
                    }
                    onToggle={setOpen}
                    className={styles.root}
                >
                    <FormStepSection
                        title={t("defineStrategy")}
                        description={
                            <Typography size="xs" variant="tertiary">
                                {t.rich("infoMessage", {
                                    targetValueName,
                                    bold: (chunks) => (
                                        <BoldText>{chunks}</BoldText>
                                    ),
                                })}
                            </Typography>
                        }
                    >
                        <KpiPresets
                            targetValueName={targetValueName}
                            value={preset}
                            onChange={setPreset}
                        />
                    </FormStepSection>
                    <FormStepSection
                        title={t("defineParameters")}
                        description={
                            <Typography size="xs" variant="tertiary">
                                {t("defaultValues")}
                            </Typography>
                        }
                        headerDecorator={
                            <div className={styles.targetChip}>
                                <Typography size="xs" weight="medium" uppercase>
                                    {t("currentTarget", { targetValueName })}
                                </Typography>
                                {loadingTargetUsdValue ? (
                                    <Skeleton width={50} size="sm" />
                                ) : (
                                    <Typography
                                        weight="medium"
                                        size="xs"
                                        uppercase
                                    >
                                        {formatUsdAmount({
                                            amount: targetUsdValue,
                                        })}
                                    </Typography>
                                )}
                            </div>
                        }
                    >
                        <KpiGoalInputs
                            kpiDistribution={kpiPayload.kpiDistribution}
                            targetValueName={targetValueName}
                            onMinimumPayoutPercentageChange={
                                handleMinumumPayoutPercentageOnChange
                            }
                            onUpperUsdTargetChange={
                                handleUpperUsdTargetOnChange
                            }
                            onLowerUsdTargetChange={
                                handleLowerUsdTargetOnChange
                            }
                        />
                    </FormStepSection>
                    <div className={styles.chartWrapper}>
                        <KpiSimulationChart
                            complex
                            targetValueName={targetValueName}
                            lowerUsdTarget={
                                kpiPayload.kpiDistribution?.goal?.lowerUsdTarget
                            }
                            upperUsdTarget={
                                kpiPayload.kpiDistribution?.goal?.upperUsdTarget
                            }
                            totalRewardsUsd={totalRewardsUsdAmount}
                            campaignDurationSeconds={campaignDurationSeconds}
                            minimumPayoutPercentage={
                                kpiPayload.kpiDistribution
                                    ?.minimumPayoutPercentage
                            }
                            targetUsdValue={targetUsdValue}
                            error={!!errors.kpi}
                        />
                    </div>
                    <div className={styles.buttons}>
                        <Button
                            onClick={handleOnApply}
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            disabled={internalDisabled || applyDisabled}
                            className={{ root: styles.button }}
                        >
                            {t("saveKpi")}
                        </Button>
                        <Button
                            onClick={handleOnSkip}
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            disabled={internalDisabled}
                            variant="secondary"
                            className={{ root: styles.button }}
                        >
                            {t("skipKpi")}
                        </Button>
                    </div>
                </FormStep>
            </div>
        </>
    );
}

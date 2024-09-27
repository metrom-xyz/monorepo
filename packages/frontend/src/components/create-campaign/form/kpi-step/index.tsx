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
    NumberInput,
    SliderInput,
    Switch,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from "react";
import { formatUsdAmount } from "@/src/utils/format";
import classNames from "classnames";
import { KpiMetric, type KpiSpecification } from "@metrom-xyz/sdk";
import { useDebounce, usePrevious } from "react-use";
import { SimulationChart } from "./simulation-chart";

import styles from "./styles.module.css";

interface KpiStepProps {
    disabled?: boolean;
    pool?: CampaignPayload["pool"];
    rewards?: CampaignPayload["rewards"];
    kpiSpecification?: CampaignPayload["kpiSpecification"];
    onKpiChange: (amm: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
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
    const [enabled, setEnabled] = useState(false);
    const [boundsError, setBoundsError] = useState("");
    const [feedback, setFeedback] = useState(false);
    const [minimumPayoutPercentage, setMinimumPayoutPercentage] = useState(
        kpiSpecification?.minimumPayoutPercentage || 0,
    );
    const [lowerUsdTargetRaw, setLowerUsdTargetRaw] = useState<
        NumberFormatValues | undefined
    >(() => {
        if (kpiSpecification) {
            return {
                floatValue: kpiSpecification.goal.lowerUsdTarget,
                formattedValue: kpiSpecification.goal.lowerUsdTarget.toString(),
                value: kpiSpecification.goal.lowerUsdTarget.toString(),
            };
        }
        return undefined;
    });
    const [upperUsdTargetRaw, setUpperUsdTargetRaw] = useState<
        NumberFormatValues | undefined
    >(() => {
        if (kpiSpecification) {
            return {
                floatValue: kpiSpecification.goal.upperUsdTarget,
                formattedValue: kpiSpecification.goal.upperUsdTarget.toString(),
                value: kpiSpecification.goal.upperUsdTarget.toString(),
            };
        }
        return undefined;
    });

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

    // this hooks is used to disable and close the step when
    // the kpi specification gets disabled, after the campaign creation
    useEffect(() => {
        if (enabled && !!prevKpiSpecification && !kpiSpecification)
            setEnabled(false);
    }, [enabled, kpiSpecification, prevKpiSpecification]);

    useEffect(() => {
        if (!feedback) return;

        const timeout = setTimeout(() => {
            setFeedback(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [feedback]);

    useEffect(() => {
        if (enabled) return;
        if (kpiSpecification) onKpiChange({ kpiSpecification: undefined });

        setMinimumPayoutPercentage(0);
        setLowerUsdTargetRaw(undefined);
        setUpperUsdTargetRaw(undefined);
        setBoundsError("");
    }, [enabled, kpiSpecification, onKpiChange]);

    useEffect(() => {
        if (!lowerUsdTargetRaw && !upperUsdTargetRaw) {
            setBoundsError("");
            return;
        }

        if (
            (!lowerUsdTargetRaw && upperUsdTargetRaw) ||
            (!upperUsdTargetRaw && lowerUsdTargetRaw)
        ) {
            setBoundsError("errors.missing");
            return;
        }

        if (!lowerUsdTargetRaw || !upperUsdTargetRaw) return;

        const { floatValue: lowerUsdTarget } = lowerUsdTargetRaw;
        const { floatValue: upperUsdTarget } = upperUsdTargetRaw;

        if (
            lowerUsdTarget !== undefined &&
            upperUsdTarget !== undefined &&
            lowerUsdTarget >= upperUsdTarget
        ) {
            setBoundsError("errors.malformed");
            return;
        }

        setBoundsError("");
    }, [lowerUsdTargetRaw, upperUsdTargetRaw]);

    useEffect(() => {
        onError({
            kpiSpecification: !!boundsError || (enabled && !kpiSpecification),
        });
    }, [boundsError, enabled, kpiSpecification, onError]);

    function handleSwitchOnClick() {
        setEnabled((enabled) => !enabled);
    }

    function handleMinimumPayoutOnChange(event: ChangeEvent<HTMLInputElement>) {
        setMinimumPayoutPercentage(Number(event.target.value));
    }

    const handleOnApply = useCallback(() => {
        if (!lowerUsdTargetRaw?.floatValue || !upperUsdTargetRaw?.floatValue)
            return;

        const { floatValue: lowerUsdTarget } = lowerUsdTargetRaw;
        const { floatValue: upperUsdTarget } = upperUsdTargetRaw;

        const kpiSpecification: KpiSpecification = {
            ...(minimumPayoutPercentage > 0
                ? { minimumPayoutPercentage: minimumPayoutPercentage / 100 }
                : {}),
            goal: {
                metric: KpiMetric.RangePoolTvl,
                lowerUsdTarget,
                upperUsdTarget,
            },
        };

        setFeedback(true);
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
            open={enabled}
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
                className={{ root: styles.preview }}
            >
                <div className={styles.tvlWrapper}>
                    <Typography uppercase weight="medium" light variant="sm">
                        {t.rich("currentTvl")}
                    </Typography>
                    <Typography weight="medium" variant="sm">
                        {formatUsdAmount(pool?.tvl)}
                    </Typography>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <div className={styles.boundInputs}>
                        <NumberInput
                            label={t("rangedTvl.lowerBound")}
                            placeholder="$0"
                            prefix="$"
                            error={!!boundsError}
                            allowNegative={false}
                            value={lowerUsdTargetRaw?.formattedValue}
                            onValueChange={setLowerUsdTargetRaw}
                        />
                        <NumberInput
                            label={t("rangedTvl.upperBound")}
                            placeholder="$0"
                            prefix="$"
                            error={!!boundsError}
                            allowNegative={false}
                            value={upperUsdTargetRaw?.formattedValue}
                            onValueChange={setUpperUsdTargetRaw}
                        />
                    </div>
                    <SliderInput
                        label={t("minimumPayout")}
                        value={minimumPayoutPercentage}
                        onChange={handleMinimumPayoutOnChange}
                        className={styles.minimumPayoutSlider}
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
                                {/* TODO: add proper disclaimer description */}
                                {t("simulation.description")}
                            </Typography>
                        </div>
                        {boundsError ? (
                            <ErrorText variant="xs" weight="medium">
                                {t("simulation.error")}
                            </ErrorText>
                        ) : (
                            <SimulationChart
                                lowerUsdTarget={lowerUsdTargetRaw?.floatValue}
                                upperUsdTarget={upperUsdTargetRaw?.floatValue}
                                totalRewardsUsd={totalRewardsUsdAmount}
                                minimumPayoutPercentage={
                                    minimumPayoutPercentage
                                }
                                poolUsdTvl={pool?.tvl}
                            />
                        )}
                    </div>
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={
                            upperUsdTargetRaw === undefined ||
                            lowerUsdTargetRaw === undefined ||
                            !!boundsError
                        }
                        onClick={handleOnApply}
                        className={{ root: styles.applyButton }}
                    >
                        {feedback ? t("applied") : t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}

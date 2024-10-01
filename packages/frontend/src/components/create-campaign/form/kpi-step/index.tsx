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
import { KpiSimulationChart } from "../../../kpi-simulation-chart";

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

    const [minimumPayoutPercentage, setMinimumPayoutPercentage] = useState(
        kpiSpecification?.minimumPayoutPercentage || 0,
    );
    const [lowerUsdTargetRaw, setLowerUsdTargetRaw] = useState<
        NumberInputValues | undefined
    >(() => {
        if (kpiSpecification) {
            return {
                raw: kpiSpecification.goal.lowerUsdTarget,
                formatted: kpiSpecification.goal.lowerUsdTarget.toString(),
            };
        }
        return undefined;
    });
    const [upperUsdTargetRaw, setUpperUsdTargetRaw] = useState<
        NumberInputValues | undefined
    >(() => {
        if (kpiSpecification) {
            return {
                raw: kpiSpecification.goal.upperUsdTarget,
                formatted: kpiSpecification.goal.upperUsdTarget.toString(),
            };
        }
        return undefined;
    });

    const [lowerUsdTargetDebounced, setLowerUsdTargetDebounced] =
        useState(lowerUsdTargetRaw);
    const [upperUsdTargetDebounced, setUpperUsdTargetDebounced] =
        useState(upperUsdTargetRaw);
    const [
        minimumPayoutPercentageDebounced,
        setMinimumPayoutPercentageDebounced,
    ] = useState(minimumPayoutPercentage);

    useDebounce(
        () => {
            setLowerUsdTargetDebounced(lowerUsdTargetRaw);
        },
        500,
        [lowerUsdTargetRaw],
    );
    useDebounce(
        () => {
            setUpperUsdTargetDebounced(upperUsdTargetRaw);
        },
        500,
        [upperUsdTargetRaw],
    );
    useDebounce(
        () => {
            setMinimumPayoutPercentageDebounced(minimumPayoutPercentage);
        },
        500,
        [minimumPayoutPercentage],
    );

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
            prevLowerTarget !== lowerUsdTargetRaw?.raw ||
            prevUpperTarget !== upperUsdTargetRaw?.raw
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
        if (!lowerUsdTargetDebounced && !upperUsdTargetDebounced) {
            setBoundsError("");
            return;
        }

        if (
            (!lowerUsdTargetDebounced && upperUsdTargetDebounced) ||
            (!upperUsdTargetDebounced && lowerUsdTargetDebounced)
        ) {
            setBoundsError("errors.missing");
            return;
        }

        if (!lowerUsdTargetDebounced || !upperUsdTargetDebounced) return;

        const { raw: lowerUsdTarget } = lowerUsdTargetDebounced;
        const { raw: upperUsdTarget } = upperUsdTargetDebounced;

        if (
            lowerUsdTarget !== undefined &&
            upperUsdTarget !== undefined &&
            lowerUsdTarget >= upperUsdTarget
        )
            setBoundsError("errors.malformed");
        else setBoundsError("");
    }, [lowerUsdTargetDebounced, upperUsdTargetDebounced]);

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

    function handleUpperUsdTargetOnChange(value: NumberFormatValues) {
        setUpperUsdTargetRaw({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleLowerUsdTargetOnChange(value: NumberFormatValues) {
        setLowerUsdTargetRaw({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleMinimumPayoutOnChange(event: ChangeEvent<HTMLInputElement>) {
        setMinimumPayoutPercentage(Number(event.target.value) / 100);
    }

    const handleOnApply = useCallback(() => {
        if (
            lowerUsdTargetDebounced?.raw === undefined ||
            upperUsdTargetDebounced?.raw === undefined
        )
            return;

        const { raw: lowerUsdTarget } = lowerUsdTargetDebounced;
        const { raw: upperUsdTarget } = upperUsdTargetDebounced;

        const kpiSpecification: KpiSpecification = {
            goal: {
                metric: KpiMetric.RangePoolTvl,
                lowerUsdTarget,
                upperUsdTarget,
            },
        };

        if (minimumPayoutPercentageDebounced)
            kpiSpecification.minimumPayoutPercentage =
                minimumPayoutPercentageDebounced;

        setOpen(false);
        onKpiChange({ kpiSpecification });
    }, [
        lowerUsdTargetDebounced,
        minimumPayoutPercentageDebounced,
        onKpiChange,
        upperUsdTargetDebounced,
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
                            value={lowerUsdTargetDebounced?.formatted}
                            onValueChange={handleLowerUsdTargetOnChange}
                        />
                        <NumberInput
                            label={t("rangedTvl.upperBound")}
                            placeholder="$0"
                            prefix="$"
                            error={!!boundsError}
                            allowNegative={false}
                            value={upperUsdTargetDebounced?.formatted}
                            onValueChange={handleUpperUsdTargetOnChange}
                        />
                    </div>
                    <SliderInput
                        label={t("minimumPayout")}
                        value={minimumPayoutPercentage * 100}
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
                        <KpiSimulationChart
                            lowerUsdTarget={lowerUsdTargetDebounced?.raw}
                            upperUsdTarget={upperUsdTargetDebounced?.raw}
                            totalRewardsUsd={totalRewardsUsdAmount}
                            minimumPayoutPercentage={
                                minimumPayoutPercentageDebounced
                            }
                            poolUsdTvl={pool?.tvl}
                            error={!!boundsError}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={
                            !unsavedChanges ||
                            upperUsdTargetDebounced === undefined ||
                            lowerUsdTargetDebounced === undefined ||
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

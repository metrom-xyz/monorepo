import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs, type ManipulateType } from "dayjs";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import { Typography } from "@/src/ui/typography";
import { DateTimePicker } from "@/src/ui/date-time-picker";
import { Button } from "@/src/ui/button";
import { Chip } from "@/src/ui/chip/chip";
import { ErrorText } from "@/src/ui/error-text";
import { useTransition, animated } from "@react-spring/web";
import { useCampaignDurationLimits } from "@/src/hooks/useCampaignDurationLimits";

import styles from "./styles.module.css";

interface EndDateStepProps {
    disabled?: boolean;
    startDate?: CampaignPayload["startDate"];
    endDate?: CampaignPayload["endDate"];
    onEndDateChange: (startDate: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

interface DurationPreset {
    label: string;
    unit: ManipulateType;
    value: number;
}

const DURATION_PRESETS: DurationPreset[] = [
    {
        label: "durations.1week",
        unit: "days",
        value: 7,
    },
    {
        label: "durations.2weeks",
        unit: "days",
        value: 14,
    },
    {
        label: "durations.1month",
        unit: "months",
        value: 1,
    },
];

export function EndDateStep({
    disabled,
    startDate,
    endDate,
    onEndDateChange,
    onError,
}: EndDateStepProps) {
    const t = useTranslations("newCampaign.form.endDate");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Dayjs | undefined>(endDate);
    const [durationPreset, setDurationPreset] = useState<DurationPreset>();
    const [dateError, setDateError] = useState("");

    const chainId = useChainId();

    const { limits } = useCampaignDurationLimits();

    const transition = useTransition(dateError, {
        exitBeforeEnter: true,
        trail: 100,
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 100 },
    });

    const secondsDuration = useMemo(() => {
        if (!date) return 0;
        return date.diff(startDate, "seconds", false);
    }, [date, startDate]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled) return;
        setOpen(true);
    }, [disabled]);

    useEffect(() => {
        if (!date || !startDate || !limits) {
            onError({ endDate: false });
            setDateError("");
            return;
        }

        const campaignDuration = date.diff(startDate, "seconds");

        let dateError = "";
        if (date.isBefore(startDate)) dateError = t("errors.endBeforeStart");
        else if (date.isBefore(dayjs())) dateError = t("errors.dateInThePast");
        else if (campaignDuration < limits.minimumSeconds)
            dateError = t("errors.minimumDate", {
                duration: Math.floor(limits.minimumSeconds / 60),
            });
        else if (campaignDuration > limits.maximumSeconds)
            dateError = t("errors.maximumDate", {
                duration: Math.floor(limits.maximumSeconds / 60 / 60 / 24),
            });

        onError({ endDate: !!dateError });
        setDateError(dateError);
    }, [date, limits, onError, startDate, t]);

    const handleStepOnClick = useCallback(() => {
        if (open && !endDate) setDate(undefined);
        if (open) setDate(endDate);
        setOpen((open) => !open);
    }, [endDate, open]);

    const handleDateOnApply = useCallback(() => {
        onEndDateChange({ endDate: dayjs(date) });
        setOpen(false);
    }, [date, onEndDateChange]);

    const getDurationPresetHandler = useCallback(
        (newDurationPreset: DurationPreset) => {
            return () => {
                if (newDurationPreset.label === durationPreset?.label) {
                    setDate(
                        startDate?.subtract(
                            newDurationPreset.value,
                            newDurationPreset.unit,
                        ),
                    );
                    setDurationPreset(undefined);
                    return;
                }

                setDate(
                    startDate?.add(
                        newDurationPreset.value,
                        newDurationPreset.unit,
                    ),
                );
                setDurationPreset(newDurationPreset);
            };
        },
        [durationPreset?.label, startDate],
    );

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!date || !!endDate}
            error={!!dateError}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <Typography
                            uppercase
                            weight="medium"
                            variant="sm"
                            className={styles.previewLabel}
                        >
                            {t("title")}
                        </Typography>
                        {transition(
                            (styles, error) =>
                                !!error && (
                                    <animated.div style={styles}>
                                        <ErrorText variant="xs" weight="medium">
                                            {error}
                                        </ErrorText>
                                    </animated.div>
                                ),
                        )}
                    </div>
                }
            >
                <Typography
                    uppercase
                    variant="lg"
                    weight="medium"
                    className={styles.dateText}
                >
                    {dayjs(date || endDate)
                        .format("DD MMM YYYY | HH:mm")
                        .toUpperCase()}
                </Typography>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <div className={styles.durationPresetsWrapper}>
                        {DURATION_PRESETS.map((preset, index) => (
                            <Chip
                                key={index}
                                clickable
                                onClick={getDurationPresetHandler(preset)}
                                active={preset.label === durationPreset?.label}
                            >
                                {t(preset.label)}
                            </Chip>
                        ))}
                    </div>
                    <DateTimePicker
                        value={date}
                        min={startDate}
                        range={{ from: startDate, to: date }}
                        // TODO: add max campaign duration limit
                        onChange={setDate}
                    />
                    <div className={styles.campaignDuration}>
                        <Typography
                            uppercase
                            variant="sm"
                            weight="medium"
                            light
                        >
                            {t("campaignDuration")}
                        </Typography>
                        <Typography uppercase variant="sm" weight="medium">
                            {startDate ? startDate.to(date, true) : "-"}
                        </Typography>
                    </div>
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={!date || !!dateError}
                        onClick={handleDateOnApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}

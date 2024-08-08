import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import dayjs, { type Dayjs, type ManipulateType } from "dayjs";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { Typography } from "@/src/ui/typography";
import { DateTimePicker } from "@/src/ui/date-time-picker";
import { Button } from "@/src/ui/button";
import { Chip } from "@/src/ui/chip/chip";

import styles from "./styles.module.css";

interface EndDateStepProps {
    disabled?: boolean;
    startDate?: CampaignPayload["startDate"];
    endDate?: CampaignPayload["endDate"];
    onEndDateChange: (startDate: CampaignPayloadPart) => void;
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
        label: "durations.3weeks",
        unit: "days",
        value: 21,
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
}: EndDateStepProps) {
    const t = useTranslations("newCampaign.form.endDate");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Dayjs | undefined>(endDate);
    const [durationPreset, setDurationPreset] = useState<DurationPreset>();
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

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
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {/* TODO: add errors */}
                <Typography
                    uppercase
                    variant="lg"
                    weight="medium"
                    className={{ root: styles.dateText }}
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
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={!date}
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

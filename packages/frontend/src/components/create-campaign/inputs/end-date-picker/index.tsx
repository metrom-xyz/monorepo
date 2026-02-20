"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import dayjs, { type Dayjs, type ManipulateType } from "dayjs";
import type {
    CampaignPayloadErrors,
    BaseCampaignPayloadPart,
} from "@/src/types/campaign/common";
import type { TranslationsKeys } from "@/src/types/utils";
import { DateTimePicker, Chip, TextInput, Popover } from "@metrom-xyz/ui";
import { useCampaignDurationLimits } from "@/src/hooks/useCampaignDurationLimits";
import { formatDateTime } from "@/src/utils/format";
import { CalendarIcon } from "@/src/assets/calendar-icon";

import styles from "./styles.module.css";

interface EndDatePickerProps {
    disabled?: boolean;
    startDate?: Dayjs;
    endDate?: Dayjs;
    onChange: (date: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

interface DurationPreset {
    label: TranslationsKeys<"newCampaign.inputs.endDatePicker">;
    unit: ManipulateType;
    value: number;
}

const DURATION_PRESETS: DurationPreset[] = [
    {
        label: "durations.1w",
        unit: "days",
        value: 7,
    },
    {
        label: "durations.2w",
        unit: "days",
        value: 14,
    },
    {
        label: "durations.1m",
        unit: "months",
        value: 1,
    },
];

export function EndDatePicker({
    disabled,
    startDate,
    endDate,
    onChange,
    onError,
}: EndDatePickerProps) {
    const [durationPreset, setDurationPreset] = useState<DurationPreset>();
    const [dateError, setDateError] = useState("");
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const t = useTranslations("newCampaign.inputs.endDatePicker");
    const popoverRef = useRef<HTMLDivElement>(null);
    const { limits } = useCampaignDurationLimits();

    // const prevDate = usePrevious(endDate);

    // const unsavedChanges = useMemo(() => {
    //     if (!prevDate) return true;
    //     return !prevDate.isSame(date);
    // }, [date, prevDate]);

    useEffect(() => {
        if (!endDate || !startDate || !limits) {
            onError({ endDate: false });
            setDateError("");
            return;
        }

        const campaignDuration = endDate.diff(startDate, "seconds");

        let dateError = "";
        if (endDate.isBefore(startDate)) dateError = t("endBeforeStart");
        else if (endDate.isBefore(dayjs())) dateError = t("dateInThePast");
        else if (campaignDuration < limits.minimumSeconds)
            dateError = t("minimumDate", {
                duration: dayjs(startDate).to(
                    startDate.add(limits.minimumSeconds, "second"),
                    true,
                ),
            });
        else if (campaignDuration > limits.maximumSeconds)
            dateError = t("maximumDate", {
                duration: dayjs(startDate).to(
                    startDate.add(limits.maximumSeconds, "second"),
                    true,
                ),
            });

        onError({ endDate: !!dateError });
        setDateError(dateError);
    }, [limits, endDate, startDate, onError, t]);

    function handleInputOnClick() {
        setPopover((prev) => !prev);
    }

    const getDurationPresetHandler = useCallback(
        (newDurationPreset: DurationPreset) => {
            return () => {
                if (newDurationPreset.label === durationPreset?.label) {
                    onChange({
                        endDate: startDate?.subtract(
                            newDurationPreset.value,
                            newDurationPreset.unit,
                        ),
                    });
                    setDurationPreset(undefined);
                    return;
                }

                onChange({
                    endDate: startDate?.add(
                        newDurationPreset.value,
                        newDurationPreset.unit,
                    ),
                });
                setDurationPreset(newDurationPreset);
            };
        },
        [durationPreset?.label, startDate, onChange],
    );

    const handleDateOnChange = useCallback(
        (date: Dayjs) => {
            onChange({ endDate: dayjs(date) });
        },
        [onChange],
    );

    return (
        <>
            <div ref={setAnchor} className={styles.inputWrapper}>
                <TextInput
                    size="lg"
                    label={t("label")}
                    disabled={disabled}
                    focused={popover}
                    value={endDate ? formatDateTime(endDate) : ""}
                    onClick={handleInputOnClick}
                    error={!!dateError}
                    errorText={dateError}
                    readOnly
                    icon={CalendarIcon}
                    iconPlacement="left"
                    endAdornment={
                        <div className={styles.presets}>
                            {DURATION_PRESETS.map((preset, index) => (
                                <Chip
                                    key={index}
                                    size="xs"
                                    variant="secondary"
                                    disabled={disabled}
                                    active={
                                        preset.label === durationPreset?.label
                                    }
                                    onClick={getDurationPresetHandler(preset)}
                                >
                                    {t(preset.label)}
                                </Chip>
                            ))}
                        </div>
                    }
                    className={styles.input}
                />
            </div>
            <Popover
                ref={popoverRef}
                contained
                anchor={anchor}
                open={popover}
                onOpenChange={setPopover}
                placement="bottom-start"
                margin={4}
            >
                <DateTimePicker
                    value={endDate}
                    min={startDate}
                    range={{ from: startDate, to: endDate }}
                    onChange={handleDateOnChange}
                />
            </Popover>
        </>
    );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import type { TranslationsType } from "@/src/types/utils";
import { DateTimePicker, TextInput, Popover, Chip } from "@metrom-xyz/ui";
import {
    getClosestAvailableDateTime,
    START_DATE_BUFFER_HOURS,
} from "../../../../utils/date";
import { formatDateTime } from "@/src/utils/format";
import { CalendarIcon } from "@/src/assets/calendar-icon";

import styles from "./styles.module.css";

function getDateError(
    startDate: Dayjs | undefined,
    minDate: Dayjs | undefined,
    t: TranslationsType<"newCampaign.inputs.startDatePicker">,
): string {
    if (!startDate || !minDate) return "";

    if (startDate.isBefore(minDate)) {
        const duration =
            START_DATE_BUFFER_HOURS < 1
                ? `${START_DATE_BUFFER_HOURS * 60}m`
                : `${START_DATE_BUFFER_HOURS}h`;
        return t("dateTooSoon", { duration });
    }

    return "";
}

interface StartDatePickerProps {
    disabled?: boolean;
    startDate?: Dayjs;
    endDate?: Dayjs;
    onChange: (date: BaseCampaignPayloadPart) => void;
    onError: (error?: string) => void;
}

export function StartDatePicker({
    disabled,
    startDate,
    endDate,
    onChange,
    onError,
}: StartDatePickerProps) {
    const [minDate, setMinDate] = useState<Dayjs | undefined>(() =>
        disabled ? undefined : getClosestAvailableDateTime(),
    );
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const t = useTranslations("newCampaign.inputs.startDatePicker");
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setMinDate((prev) => {
                const next = getClosestAvailableDateTime();
                return prev?.isSame(next) ? prev : next;
            });
        }, 1_000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const dateError = getDateError(startDate, minDate, t);

    useEffect(() => {
        onError(dateError);
    }, [dateError, onError]);

    function handleInputOnClick() {
        setPopover((prev) => !prev);
    }

    const handleDateNowOnClick = useCallback(() => {
        if (disabled) return;
        onChange({ startDate: getClosestAvailableDateTime() });
    }, [disabled, onChange]);

    const handleDateOnChange = useCallback(
        (date: Dayjs) => {
            onChange({ startDate: dayjs(date) });
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
                    value={startDate ? formatDateTime(startDate) : ""}
                    onClick={handleInputOnClick}
                    error={!!dateError}
                    errorText={dateError}
                    readOnly
                    icon={CalendarIcon}
                    iconPlacement="left"
                    endAdornment={
                        <Chip
                            size="xs"
                            variant="secondary"
                            disabled={disabled}
                            onClick={handleDateNowOnClick}
                        >
                            {t("now")}
                        </Chip>
                    }
                    className={styles.input}
                />
            </div>
            <Popover
                ref={popoverRef}
                anchor={anchor}
                contained
                open={popover}
                onOpenChange={setPopover}
                placement="bottom-start"
                margin={4}
                className={styles.popover}
            >
                <DateTimePicker
                    value={startDate}
                    min={minDate}
                    range={{ from: startDate, to: endDate }}
                    onChange={handleDateOnChange}
                />
            </Popover>
        </>
    );
}

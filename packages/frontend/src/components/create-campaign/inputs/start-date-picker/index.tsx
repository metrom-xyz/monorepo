"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import type {
    CampaignPayloadErrors,
    BaseCampaignPayloadPart,
} from "@/src/types/campaign/common";
import { DateTimePicker, TextInput, Popover, Chip } from "@metrom-xyz/ui";
import { getClosestAvailableDateTime } from "../../../../utils/date";
import { formatDateTime } from "@/src/utils/format";
import { CalendarIcon } from "@/src/assets/calendar-icon";

import styles from "./styles.module.css";

interface StartDatePickerProps {
    disabled?: boolean;
    startDate?: Dayjs;
    endDate?: Dayjs;
    onChange: (date: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function StartDatePicker({
    disabled,
    startDate,
    endDate,
    onChange,
    onError,
}: StartDatePickerProps) {
    const [minDate, setMinDate] = useState<Dayjs | undefined>();
    const [dateError, setDateError] = useState("");
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const t = useTranslations("newCampaign.inputs.startDatePicker");
    const popoverRef = useRef<HTMLDivElement>(null);

    // const previousDate = usePrevious(date);
    // const prevDate = usePrevious(startDate);
    // const unsavedChanges = useMemo(() => {
    //     if (!prevDate) return true;
    //     return !prevDate.isSame(date);
    // }, [date, prevDate]);

    useEffect(() => {
        if (minDate || disabled) return;
        setMinDate(getClosestAvailableDateTime());
    }, [minDate, disabled]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (startDate?.isBefore(dayjs()))
                setMinDate(getClosestAvailableDateTime(startDate));
        }, 1_000);
        return () => {
            clearInterval(interval);
        };
    }, [startDate, minDate]);

    useEffect(() => {
        if (!startDate || !minDate /*|| !previousDate*/) return;

        let dateError = "";
        if (startDate.isBefore(minDate)) dateError = t("dateInThePast");

        onError({ startDate: !!dateError });
        setDateError(dateError);
    }, [startDate, minDate, onError, t]);

    function handleInputOnClick() {
        setPopover((prev) => !prev);
    }

    const handleDateNowOnClick = useCallback(() => {
        onChange({ startDate: getClosestAvailableDateTime(dayjs()) });
    }, [onChange]);

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
                contained
                anchor={anchor}
                open={popover}
                onOpenChange={setPopover}
                placement="bottom-start"
                margin={4}
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

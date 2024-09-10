import dayjs, { Dayjs, type UnitType } from "dayjs";
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { enforceDoubleDigits } from "@metrom-xyz/sdk";
import classNames from "@/src/utils/classes";
import {
    getUpdatedMinMaxValue,
    rectifyDate,
    resolvedValue,
} from "../../utils/date";
import { ScrollIntoView } from "../scroll-into-view";
import { DatePicker, type DatePickerProps } from "../date-picker";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export type DateTimePickerProps = DatePickerProps;

const HOURS = new Array(24).fill(null).map((_, index) => {
    return enforceDoubleDigits(index);
});

const MINUTES_INTERVALS = ["00", "15", "30", "45"];

export const DateTimePicker = ({
    value,
    onChange,
    min: minDate,
    max: maxDate,
    range,
    className,
}: DateTimePickerProps) => {
    const [min, setMin] = useState(minDate);
    const [max, setMax] = useState(maxDate);

    // avoid inconsistent min and max values
    useEffect(() => {
        const updatedMin = getUpdatedMinMaxValue(min, minDate);
        const updatedMax = getUpdatedMinMaxValue(max, maxDate);

        setMin(updatedMin);
        setMax(updatedMax);

        if (
            updatedMin &&
            updatedMax &&
            dayjs(updatedMin).isAfter(dayjs(updatedMax))
        ) {
            setMin(updatedMax);
            console.warn("inconsistent min and max values", {
                min: updatedMin?.toISOString(),
                max: updatedMax?.toISOString(),
            });
        }
    }, [min, max, minDate, maxDate]);

    // in case a value change happened, check if we're still
    // alright with validation and rectify if needed
    useLayoutEffect(() => {
        if (!value || !onChange) return;
        const originalValue = dayjs(value);
        const rectifiedValue = rectifyDate(dayjs(value), min, max);
        if (!originalValue.isSame(rectifiedValue, "seconds"))
            onChange(rectifiedValue);
    }, [max, min, onChange, value]);

    const handleDateChange = useCallback(
        (newValue: Dayjs) => {
            if (!onChange) return;
            if (!value) onChange(newValue.set("minutes", 0));
            else
                onChange(
                    dayjs(value)
                        .date(newValue.date())
                        .month(newValue.month())
                        .year(newValue.year()),
                );
        },
        [onChange, value],
    );

    const handleTimeChange = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (!onChange) return;
            const data = (event.target as HTMLLIElement).dataset.data;
            if (data !== undefined) {
                const [unit, newValue] = data.split("-");
                const parsedNewValue = parseInt(newValue);
                if (isNaN(parsedNewValue)) return;
                const initialDate = resolvedValue(value, min, max);
                let pickedDate = initialDate.set(
                    unit as UnitType,
                    parsedNewValue,
                );
                pickedDate = pickedDate.set("seconds", 0);
                onChange(rectifyDate(pickedDate, min, max));
            }
        },
        [max, min, onChange, value],
    );

    return (
        <div className={styles.root}>
            <DatePicker
                value={value}
                onChange={handleDateChange}
                min={min}
                max={max}
                range={range}
                className={className}
            />
            <div className={styles.divider} />
            <div className={styles.timeWrapper}>
                <div className={styles.header}>
                    <Typography uppercase variant="lg" weight="medium">
                        HH
                    </Typography>
                    <Typography uppercase variant="lg" weight="medium">
                        MM
                    </Typography>
                </div>
                <div className={styles.wheelsWrapper}>
                    <div
                        className={classNames(
                            styles.cellList,
                            styles.noScrollbar,
                        )}
                    >
                        {HOURS.map((hour) => {
                            const selected =
                                value && dayjs(value).format("HH") === hour;
                            let disabled = false;
                            if (value && (min || max)) {
                                const atTime = dayjs(value).hour(
                                    parseInt(hour),
                                );
                                disabled = !rectifyDate(
                                    atTime,
                                    min,
                                    max,
                                ).isSame(atTime);
                            }
                            return (
                                <ScrollIntoView
                                    key={hour}
                                    selected={!!selected}
                                >
                                    <Typography
                                        className={classNames(
                                            className?.cell,
                                            styles.cell,
                                            {
                                                [styles.cellDisabled]: disabled,
                                                [styles.cellSelectable]:
                                                    !disabled,
                                                [styles.cellSelected]: selected,
                                            },
                                        )}
                                        onClick={
                                            disabled
                                                ? undefined
                                                : handleTimeChange
                                        }
                                        data-data={`hour-${hour}`}
                                    >
                                        {hour}
                                    </Typography>
                                </ScrollIntoView>
                            );
                        })}
                    </div>
                    <div className={styles.cellList}>
                        {MINUTES_INTERVALS.map((minute) => {
                            const selected =
                                value && dayjs(value).format("mm") === minute;
                            let disabled = false;
                            if (value) {
                                const atTime = dayjs(value).minute(
                                    parseInt(minute),
                                );
                                disabled = !rectifyDate(
                                    atTime,
                                    min,
                                    max,
                                ).isSame(atTime);
                            }
                            return (
                                <ScrollIntoView
                                    key={minute}
                                    selected={!!selected}
                                >
                                    <Typography
                                        className={classNames(
                                            className?.cell,
                                            styles.cell,
                                            {
                                                [styles.cellDisabled]: disabled,
                                                [styles.cellSelectable]:
                                                    !disabled,
                                                [styles.cellSelected]: selected,
                                            },
                                        )}
                                        onClick={
                                            disabled
                                                ? undefined
                                                : handleTimeChange
                                        }
                                        data-data={`minute-${minute}`}
                                    >
                                        {minute}
                                    </Typography>
                                </ScrollIntoView>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useMemo, useState } from "react";
import { Typography } from "../typography";
import {
    getCalendarCells,
    isDateInRange,
    isOnlyDateSame,
} from "@/src/utils/date";
import { ChevronDownIcon } from "@/src/assets/chevron-down-icon";
import classNames from "@/src/utils/classes";

import styles from "./styles.module.css";

export interface DatePickerProps {
    onChange?: (date: Dayjs) => void;
    value?: Dayjs | Date | null;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
    range?: {
        from?: Dayjs | Date | null;
        to?: Dayjs | Date | null;
    };
    className?: {
        cell?: string;
    };
}

export const DatePicker = ({
    value,
    onChange,
    min,
    max,
    range,
    className,
}: DatePickerProps) => {
    // this date is used to generate cells, and is generally set to the
    // first day of the month we're currently interested in (also changed
    // when the datepicker user wants to change months)
    const [lookupDate, setLookupDate] = useState<Dayjs>(
        value ? dayjs(value) : dayjs(),
    );

    const cells = useMemo(() => getCalendarCells(lookupDate), [lookupDate]);

    const handlePreviousMonth = useCallback(() => {
        setLookupDate(lookupDate.subtract(1, "month"));
    }, [lookupDate]);

    const handleNextMonth = useCallback(() => {
        setLookupDate(lookupDate.add(1, "month"));
    }, [lookupDate]);

    const handleCellClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (!onChange || !event.target) return;
            const index = (event.target as HTMLLIElement).dataset.index;
            if (index !== undefined) {
                const parsedIndex = parseInt(index);
                if (parsedIndex >= 0) onChange(cells[parsedIndex].value);
            }
        },
        [cells, onChange],
    );

    return (
        <div className={classNames(styles.root)}>
            <div className={classNames(styles.header)}>
                <div
                    className={styles.headerIconWrapper}
                    onClick={handlePreviousMonth}
                >
                    <ChevronDownIcon className={styles.rotateLeft} />
                </div>
                <Typography
                    uppercase
                    variant="lg"
                    weight="medium"
                    className={styles.headerMonth}
                >
                    {lookupDate.format("MMM YYYY")}
                </Typography>
                <div
                    className={styles.headerIconWrapper}
                    onClick={handleNextMonth}
                >
                    <ChevronDownIcon className={styles.rotateRight} />
                </div>
            </div>
            <div className={styles.weeksHeader}>
                {cells.slice(0, 7).map((cell) => {
                    const dayOfWeek = cell.value.day();
                    return (
                        <Typography
                            key={dayOfWeek}
                            variant="sm"
                            uppercase
                            className={styles.weekDay}
                            weight="medium"
                        >
                            {cell.value.format("dd")}
                        </Typography>
                    );
                })}
            </div>
            <div className={styles.calendar}>
                {cells.map((cell, index) => {
                    const disabled =
                        (min && cell.value.isBefore(min, "day")) ||
                        (max && cell.value.isAfter(max, "day")) ||
                        cell.value.month() !== lookupDate.month();
                    const selected =
                        !disabled &&
                        dayjs(value).month() === cell.value.month() &&
                        dayjs(value).date() === cell.value.date();
                    return (
                        <Typography
                            onClick={disabled ? undefined : handleCellClick}
                            key={index}
                            data-index={index}
                            light={isDateInRange(
                                dayjs(cell.value),
                                range?.from,
                                range?.to,
                            )}
                            className={classNames(
                                className?.cell,
                                styles.cell,
                                {
                                    [styles.cellToday]: dayjs().isSame(
                                        cell.value,
                                        "days",
                                    ),
                                    [styles.cellDisabled]: disabled,
                                    [styles.cellSelected]: selected,
                                    [styles.cellInRange]: isDateInRange(
                                        dayjs(cell.value),
                                        range?.from,
                                        range?.to,
                                    ),
                                    [styles.cellRangeBoundStart]:
                                        range?.from && range.to
                                            ? isOnlyDateSame(
                                                  cell.value,
                                                  range.from,
                                              )
                                            : false,
                                    [styles.cellRangeBoundEnd]:
                                        range?.from && range.to
                                            ? isOnlyDateSame(
                                                  cell.value,
                                                  range.to,
                                              )
                                            : false,
                                    [styles.startOfWeek]: index % 7 === 0,
                                    [styles.endOfWeek]: (index + 1) % 7 === 0,
                                },
                            )}
                        >
                            {cell.text}
                        </Typography>
                    );
                })}
            </div>
        </div>
    );
};

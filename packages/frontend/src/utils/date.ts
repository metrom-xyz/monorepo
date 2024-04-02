import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { enforceDoubleDigits } from "./formatting";

// our interface for a single cell
export interface CalendarCell {
    text: string;
    value: Dayjs;
}

const prepareCell = (date: Dayjs, dayNumber: number) => {
    return {
        text: String(dayNumber),
        value: date.clone().set("date", dayNumber),
    };
};

export const getCalendarCells = (date: Dayjs): CalendarCell[] => {
    const daysInMonth = date.daysInMonth();
    const calendarCells: CalendarCell[] = [];

    // push current month day cells
    for (let i = 0; i < daysInMonth; i++)
        calendarCells.push(prepareCell(date, i + 1));

    // we always aim to have a constant day-week cell array
    // so that the first cell starts at monday and the 7th
    // ends on sunday
    const firstDateDayOfWeek = calendarCells[0].value.day();
    const cellsToPrepend =
        firstDateDayOfWeek === 0 ? 6 : firstDateDayOfWeek - 1;

    // add to start from prev month
    const lastMonth = date.subtract(1, "month");
    for (let i = 0; i < cellsToPrepend; i++)
        calendarCells.unshift(
            prepareCell(lastMonth, lastMonth.daysInMonth() - i),
        );

    // add to end from next month
    const nextMonth = date.add(1, "month");
    const calendarCellsLength = calendarCells.length;
    for (let i = 0; i < 42 - calendarCellsLength; i++)
        calendarCells.push(prepareCell(nextMonth, i + 1));

    return calendarCells;
};

export const isCalendarCellDisabled = (
    cell: CalendarCell,
    lookupDate?: Dayjs | Date | null,
    min?: Dayjs | Date | null,
    max?: Dayjs | Date | null,
) => {
    return (
        (min && cell.value.isBefore(min, "day")) ||
        (max && cell.value.isAfter(max, "day")) ||
        cell.value.month() !== dayjs(lookupDate).month()
    );
};

export const isCalendarCellSelected = (
    cell: CalendarCell,
    lookupDate?: Dayjs | Date | null,
    min?: Dayjs | Date | null,
    max?: Dayjs | Date | null,
) => {
    if (!lookupDate) return false;
    return (
        !isCalendarCellDisabled(cell, lookupDate, min, max) &&
        dayjs(lookupDate).year() === cell.value.year() &&
        dayjs(lookupDate).month() === cell.value.month() &&
        dayjs(lookupDate).date() === cell.value.date()
    );
};

export const isCalendarCellStartRangeDate = (
    cell: CalendarCell,
    from?: Dayjs | Date | null,
    lookupDate?: Dayjs | Date | null,
) => {
    return (
        cell.value.isSame(from) ||
        cell.value.day() === 1 ||
        dayjs(lookupDate).startOf("month").date() === cell.value.date()
    );
};

export const isCalendarCellEndRangeDate = (
    cell: CalendarCell,
    to?: Dayjs | Date | null,
    lookupDate?: Dayjs | Date | null,
) => {
    return (
        cell.value.isSame(to) ||
        cell.value.day() === 0 ||
        dayjs(lookupDate).endOf("month").date() === cell.value.date()
    );
};

export const isCalendarCellInRange = (
    cell: CalendarCell,
    from?: Dayjs | Date | null,
    to?: Dayjs | Date | null,
) => {
    if (!from || !to) return false;
    return (
        (cell.value.isSame(from) || cell.value.isAfter(from)) &&
        (cell.value.isSame(to) || cell.value.isBefore(to))
    );
};

export const isCalendarTimeCellDisabled = (
    timeUnit: "hour" | "minute" | "second",
    timeValue: string,
    lookupDate?: Dayjs | Date | null,
    min?: Dayjs | Date | null,
    max?: Dayjs | Date | null,
) => {
    let disabled = false;
    if (lookupDate && (min || max)) {
        let atTime: Dayjs;
        switch (timeUnit) {
            case "hour": {
                atTime = dayjs(lookupDate).hour(parseInt(timeValue));
                break;
            }
            case "minute": {
                atTime = dayjs(lookupDate).minute(parseInt(timeValue));
                break;
            }
            case "second": {
                atTime = dayjs(lookupDate).second(parseInt(timeValue));
                break;
            }
            default: {
                atTime = dayjs();
            }
        }
        disabled = !dayjs(rectifyDate(atTime, min, max)).isSame(atTime);
    }
    return disabled;
};

export const isCalendarTimeCellSelected = (
    timeUnit: "HH" | "mm" | "ss",
    timeValue: string,
    lookupDate?: Dayjs | Date | null,
) => {
    return lookupDate && dayjs(lookupDate).format(timeUnit) === timeValue;
};

export const getUpdatedMinMaxValue = (
    previousValue?: Dayjs | Date | null,
    newValue?: Dayjs | Date | null,
) => {
    if (!newValue) return previousValue;
    const parsedPreviousValue = dayjs(previousValue);
    if (!parsedPreviousValue.isValid()) return newValue;
    if (parsedPreviousValue.isSame(newValue, "seconds")) return previousValue;
    return newValue;
};

export const rectifyDate = (
    value: Dayjs | Date,
    min?: Dayjs | Date | null,
    max?: Dayjs | Date | null,
) => {
    if (min && dayjs(value).isBefore(min, "seconds")) return dayjs(min);
    if (max && dayjs(value).isAfter(max, "seconds")) return dayjs(max);
    return value;
};

export const resolvedValue = (
    value?: Dayjs | Date | null,
    min?: Dayjs | Date | null,
    max?: Dayjs | Date | null,
) => {
    return rectifyDate(value ? dayjs(value) : dayjs(), min, max);
};

export const HOURS = new Array(24).fill(null).map((_, index) => {
    return enforceDoubleDigits(index);
});

export const MINUTES_SECONDS = new Array(60).fill(null).map((_, index) => {
    return enforceDoubleDigits(index);
});

export const isDateInRange = (
    date: Dayjs,
    from?: Dayjs | Date | null,
    to?: Dayjs | Date | null,
) => {
    if (!from || !to) return false;
    return (
        (date.isSame(from) || date.isAfter(from)) &&
        (date.isSame(to) || date.isBefore(to))
    );
};

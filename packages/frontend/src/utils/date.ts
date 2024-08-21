import dayjs, { type Dayjs } from "dayjs";

export interface CalendarCell {
    text: string;
    value: Dayjs;
}

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

export const resolvedValue = (
    value?: Dayjs | Date | null,
    min?: Dayjs | Date | null,
    max?: Dayjs | Date | null,
) => {
    return rectifyDate(value ? dayjs(value) : dayjs(), min, max);
};

export const rectifyDate = (
    value: Dayjs | Dayjs,
    min?: Dayjs | Date | null,
    max?: Dayjs | Date | null,
) => {
    if (!!(min && value.isBefore(min, "seconds"))) return dayjs(min);
    if (!!(max && value.isAfter(max, "seconds"))) return dayjs(max);
    return value;
};

export const isDateInRange = (
    date: Dayjs,
    from?: Dayjs | Date | null,
    to?: Dayjs | Date | null,
) => {
    if (!from || !to) return false;
    return date.isAfter(from, "days") && date.isBefore(to, "days");
};

export const isOnlyDateSame = (
    dateA?: Dayjs | Date | null,
    dateB?: Dayjs | Date | null,
) => {
    return (
        dayjs(dateA).year() === dayjs(dateB).year() &&
        dayjs(dateA).month() === dayjs(dateB).month() &&
        dayjs(dateA).date() === dayjs(dateB).date()
    );
};

export const getClosestAvailableDateTime = (date?: Dayjs | Date | null) => {
    // if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "production") return dayjs();

    const minutes = dayjs(date).get("minutes");
    if (minutes < 15) return dayjs(date).set("minutes", 15).set("seconds", 0);
    if (minutes < 30) return dayjs(date).set("minutes", 30).set("seconds", 0);
    if (minutes < 45) return dayjs(date).set("minutes", 45).set("seconds", 0);
    return dayjs(date).add(1, "hour").set("minutes", 0).set("seconds", 0);
};

import type { Dayjs } from "dayjs";

export interface DateRangeInputCalendarProps {
    dateInRange?: (date: Dayjs) => boolean;
    leftPicker?: boolean;
    value?: Dayjs;
    lookupDate: Dayjs;
    from?: Dayjs | Date | null;
    to?: Dayjs | Date | null;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
}

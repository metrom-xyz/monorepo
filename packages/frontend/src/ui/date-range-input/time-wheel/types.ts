import type { Dayjs } from "dayjs";

export interface DateRangeInputTimeWheelProps {
    value?: Dayjs | Date | null;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
}

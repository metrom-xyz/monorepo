import type { Dayjs } from "dayjs";

export interface DateRangeInputProps {
    onStartDatePick?: (Dayjs: Dayjs) => void;
    onEndDatePick?: (Dayjs: Dayjs) => void;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
    messages: {
        startLabel: string;
        endLabel: string;
        startPlaceholder: string;
        endPlaceholder: string;
    };
}

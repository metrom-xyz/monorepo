import type { Dayjs } from "dayjs";

export interface Range {
    from?: Dayjs;
    to?: Dayjs;
}

export interface DateRangeInputProps {
    error?: boolean;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
    messages: {
        startLabel: string;
        endLabel: string;
        startPlaceholder: string;
        endPlaceholder: string;
    };
}

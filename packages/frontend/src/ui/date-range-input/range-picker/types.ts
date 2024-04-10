import type { Dayjs } from "dayjs";

export interface DateRangeInputPickerProps {
    onDismiss?: () => void;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
    messages: {
        startLabel: string;
        endLabel: string;
    };
}

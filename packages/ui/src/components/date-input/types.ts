import type { Dayjs } from "dayjs";

export interface DateInputProps {
    time?: boolean;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
    lookupDate?: Dayjs | Date | null;
    messages: {
        label?: string;
        placeholder: string;
    };
}

export interface DateTimeWheelProps {
    value?: Dayjs | Date | null;
    min?: Dayjs | Date | null;
    max?: Dayjs | Date | null;
}

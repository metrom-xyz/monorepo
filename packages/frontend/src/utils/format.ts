import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";

export function formatUsdAmount(amount?: number | null): string {
    if (amount && amount < 0.01) return "$<0.01";
    return numeral(amount).format("($0,0.0[0]a)");
}

export function formatPercentage(amount?: number | null): string {
    if (amount && amount < 0.01) return "<0.01%";
    return `${numeral(amount).format("0,0.0[0]a")}%`;
}

export function formatTokenAmount({
    amount,
    humanize = true,
}: {
    amount?: number | null;
    humanize?: boolean;
}): string {
    if (amount && amount < 0.0001) return "<0.0001";
    return `${numeral(amount).format(`0,0.0[000]${humanize ? "a" : ""}`)}`;
}

export function formatDateTime(dateTime?: Dayjs | Date): string {
    if (!dateTime) return "-";
    if (dateTime instanceof Date) dateTime = dayjs(dateTime);
    return dateTime.format("DD MMM YYYY | HH:mm");
}

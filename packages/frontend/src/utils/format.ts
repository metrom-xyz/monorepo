import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";

export function formatUsdAmount(amount?: number | null): string {
    if (amount && amount < 0.01) return "$<0.01";
    return numeral(amount).format("($0,0.0[0]a)");
}

export function formatPercentage({
    percentage,
    keepDust,
    humanize = true,
}: {
    percentage?: number | null;
    keepDust?: boolean;
    humanize?: boolean;
}): string {
    if (percentage && !keepDust && percentage < 0.01) return "<0.01%";
    return `${numeral(percentage).format(`0,0.0[${keepDust ? "000" : "0"}]${humanize ? "a" : ""}`)}%`;
}

export function formatAmount({
    amount,
    humanize = true,
}: {
    amount?: number | null;
    humanize?: boolean;
}): string {
    if (amount && amount < 0.0001) return "<0.0001";
    return `${numeral(amount).format(`0,0.0[000]${humanize ? "a" : ""}`)}`;
}

export function formatDateTime(dateTime?: Dayjs | number): string {
    if (!dateTime) return "-";
    if (typeof dateTime === "number") dateTime = dayjs.unix(dateTime);
    return dateTime.format("DD MMM YYYY | HH:mm");
}

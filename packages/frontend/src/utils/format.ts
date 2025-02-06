import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";

const HUMANIZE_CUTOFF = 100000;

export function formatUsdAmount(amount?: number | null): string {
    if (amount && amount < 0.01) return "$<0.01";
    return numeral(amount).format(
        `($0,0.0[0]${amount && amount > HUMANIZE_CUTOFF ? "a" : ""})`,
    );
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
    if (percentage && percentage > 10000) return ">10k%";
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
    if (amount && amount > HUMANIZE_CUTOFF)
        return numeral(amount).format(`0,0.0[000]`);
    return numeral(amount).format(`0,0.0[000]${humanize ? "a" : ""}`);
}

export function formatDateTime(dateTime?: Dayjs | number): string {
    if (!dateTime) return "-";
    if (typeof dateTime === "number") dateTime = dayjs.unix(dateTime);
    return dateTime.format("DD MMM YYYY | HH:mm");
}

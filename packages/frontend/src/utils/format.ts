import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";

const HUMANIZE_AMOUNT_CUTOFF = 100_000;
const HUMANIZE_PERCENTAGE_CUTOFF = 100_000;

export function formatUsdAmount(amount?: number | null): string {
    if (amount && amount < 0.01) return "$<0.01";
    return numeral(amount).format(
        `($0,0.0[0]${amount && amount > HUMANIZE_AMOUNT_CUTOFF ? "a" : ""})`,
    );
}

export function formatPercentage({
    percentage,
    keepDust,
}: {
    percentage?: number | null;
    keepDust?: boolean;
}): string {
    if (percentage && !keepDust && percentage < 0.01) return "<0.01%";
    if (percentage && percentage > HUMANIZE_PERCENTAGE_CUTOFF) return ">100k%";
    return `${numeral(percentage).format(`0,0.0[${keepDust ? "000" : "0"}]`)}%`;
}

export function formatAmount({ amount }: { amount?: number | null }): string {
    if (amount && amount < 0.0001) return "<0.0001";
    return numeral(amount).format(
        `0,0.0[000]${amount && amount > HUMANIZE_AMOUNT_CUTOFF ? "a" : ""}`,
    );
}

export function formatDateTime(dateTime?: Dayjs | number): string {
    if (!dateTime) return "-";
    if (typeof dateTime === "number") dateTime = dayjs.unix(dateTime);
    return dateTime.format("DD MMM YYYY | HH:mm");
}

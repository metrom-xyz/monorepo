import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";

const HIDE_DECIMALS_AMOUNT_CUTOFF = 1000;
const HUMANIZE_AMOUNT_CUTOFF = 100_000;
const HUMANIZE_PERCENTAGE_CUTOFF = 100_000;

interface FormatAmountParams {
    amount?: number | null;
    cutoff?: boolean;
}

export function formatUsdAmount({
    amount,
    cutoff = true,
}: FormatAmountParams): string {
    if (amount && amount < 0.01) return "$<0.01";
    if (amount && amount < HIDE_DECIMALS_AMOUNT_CUTOFF)
        return numeral(amount).format("($0,0.[00])");

    return numeral(amount).format(
        `($0,0]${amount && cutoff && amount >= HUMANIZE_AMOUNT_CUTOFF ? "a" : ""})`,
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
    return `${numeral(percentage).format(`0,0.[${keepDust ? "000" : "00"}]`)}%`;
}

export function formatAmount({
    amount,
    cutoff = true,
}: FormatAmountParams): string {
    if (amount && amount < 0.0001) return "<0.0001";
    return numeral(amount).format(
        `0,0.[000]${amount && cutoff && amount > HUMANIZE_AMOUNT_CUTOFF ? "a" : ""}`,
    );
}

export function formatAmountChange({
    amount,
    cutoff = true,
}: FormatAmountParams): string {
    if (amount && amount < 0.0001 && amount > -0.0001) {
        return amount > 0 ? "+<0.0001" : "-<0.0001";
    }

    const formatted = numeral(amount).format(
        `0,0.[000]${amount && cutoff && amount > HUMANIZE_AMOUNT_CUTOFF ? "a" : ""}`,
    );

    if (amount && amount > 0) return `+${formatted}`;
    return formatted;
}

export function formatDateTime(dateTime?: Dayjs | number): string {
    if (!dateTime) return "-";
    if (typeof dateTime === "number") dateTime = dayjs.unix(dateTime);
    return dateTime.format("DD MMM YYYY | HH:mm");
}

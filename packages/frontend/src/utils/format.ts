import numeral from "numeral";

export function formatUsdAmount(amount?: number | null): string {
    return numeral(amount).format("($0,0.0[0]a)");
}

export function formatPercentage(amount?: number | null): string {
    return numeral(amount).format("0,0.0[0]a");
}

export function formatTokenAmount(amount?: number | null): string {
    return `${numeral(amount).format("0,0.0[0][0][0]a")}`;
}

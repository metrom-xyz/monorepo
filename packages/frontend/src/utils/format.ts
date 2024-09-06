import numeral from "numeral";

export function formatUsdAmount(amount?: number | null): string {
    if (amount && amount < 0.01) return "<0.01";
    return numeral(amount).format("($0,0.0[0]a)");
}

export function formatPercentage(amount?: number | null): string {
    if (amount && amount < 0.01) return "<0.01";
    return numeral(amount).format("0,0.0[0]a");
}

export function formatTokenAmount(amount?: number | null): string {
    if (amount && amount < 0.0001) return "<0.0001";
    return `${numeral(amount).format("0,0.0[0][0][0]a")}`;
}

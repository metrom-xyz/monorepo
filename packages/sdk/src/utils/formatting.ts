export const enforceDoubleDigits = (n: number): string => {
    return n < 10 ? `0${n}` : n.toString();
};

export interface FormatDecimalsParams {
    number: string;
    decimalsAmount?: number;
    commify?: boolean;
}

export const formatDecimals = ({
    number,
    decimalsAmount = 4,
    commify = true,
}: FormatDecimalsParams) => {
    const num = parseFloat(number);
    if (isNaN(num)) return number;
    let formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalsAmount,
        useGrouping: commify,
    }).format(num);

    if (formatted.includes(".")) {
        formatted = formatted.replace(/(\.\d*?[1-9])0+$/, "$1");
        formatted = formatted.replace(/\.0*$/, "");
    }

    return formatted;
};

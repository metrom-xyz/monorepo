import { formatUnits } from "viem";
import { type Erc20TokenAmount } from "../entities";

export const enforceDoubleDigits = (n: number): string => {
    return n < 10 ? `0${n}` : n.toString();
};

export interface FormatCurrencyAmountParams {
    amount: Erc20TokenAmount;
    withSymbol?: boolean;
    commify?: boolean;
    nonZeroDecimalsAmount?: number;
}

export const formatErc20TokenAmount = ({
    amount,
    withSymbol = true,
    commify = true,
    nonZeroDecimalsAmount = 4,
}: FormatCurrencyAmountParams) => {
    const rawBaseAmount = formatDecimals({
        number: formatUnits(amount.amount, amount.token.decimals),
        decimalsAmount: nonZeroDecimalsAmount,
        commify,
    });
    return withSymbol
        ? `${rawBaseAmount} ${amount.token.symbol}`
        : rawBaseAmount;
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
}: FormatDecimalsParams): string => {
    const decimalIndex = number.indexOf(".");
    if (decimalIndex === -1)
        return commify ? Number(number).toLocaleString() : number;
    let i = decimalIndex + 1;
    while (i < number.length) {
        if (number[i] !== "0") {
            i += decimalsAmount;
            break;
        }
        i++;
    }
    return commify
        ? Number(number.substring(0, i)).toLocaleString()
        : number.substring(0, i);
};

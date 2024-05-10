import type { TokenInfo } from "@uniswap/token-lists";
import { parseUnits } from "viem";

export const getRewardPlusFeeAmount = (
    token: TokenInfo,
    amount?: number,
    globalFee?: number,
) => {
    if (!globalFee || !amount) return 0n;

    return (
        parseUnits(amount.toString(), token.decimals) +
        (parseUnits(amount.toString(), token.decimals) *
            BigInt(globalFee.toString())) /
            1_000_000n
    );
};

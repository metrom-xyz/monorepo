import { BigInt } from "@graphprotocol/graph-ts";
import { BI_0, BI_1, BI_MAX_U256, BI_Q96 } from "./commons";

export function getAmount0(
    tickLower: i32,
    tickUpper: i32,
    currTick: i32,
    amount: BigInt,
    currSqrtPriceX96: BigInt,
): BigInt {
    const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);

    let amount0 = BI_0;
    const roundUp = amount.gt(BI_0);

    if (currTick < tickLower) {
        amount0 = SqrtPriceMath.getAmount0Delta(
            sqrtRatioAX96,
            sqrtRatioBX96,
            amount,
            roundUp,
        );
    } else if (currTick < tickUpper) {
        amount0 = SqrtPriceMath.getAmount0Delta(
            currSqrtPriceX96,
            sqrtRatioBX96,
            amount,
            roundUp,
        );
    } else {
        amount0 = BI_0;
    }

    return amount0;
}

export function getAmount1(
    tickLower: i32,
    tickUpper: i32,
    currTick: i32,
    amount: BigInt,
    currSqrtPriceX96: BigInt,
): BigInt {
    const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);

    let amount1 = BI_0;
    const roundUp = amount.gt(BI_0);

    if (currTick < tickLower) {
        amount1 = BI_0;
    } else if (currTick < tickUpper) {
        amount1 = SqrtPriceMath.getAmount1Delta(
            sqrtRatioAX96,
            currSqrtPriceX96,
            amount,
            roundUp,
        );
    } else {
        amount1 = SqrtPriceMath.getAmount1Delta(
            sqrtRatioAX96,
            sqrtRatioBX96,
            amount,
            roundUp,
        );
    }

    return amount1;
}

function mulShift(val: BigInt, mulBy: BigInt): BigInt {
    return val.times(mulBy).rightShift(128);
}

export abstract class TickMath {
    public static MIN_TICK: number = -887272;
    public static MAX_TICK: number = -TickMath.MIN_TICK;

    public static MIN_SQRT_RATIO: BigInt = BigInt.fromString("4295128739");
    public static MAX_SQRT_RATIO: BigInt = BigInt.fromString(
        "1461446703485210103287273052203988822378723970342",
    );

    public static getSqrtRatioAtTick(tick: i32): BigInt {
        if (tick < TickMath.MIN_TICK || tick > TickMath.MAX_TICK) {
            throw new Error("TICK");
        }
        const absTick: i32 = tick < 0 ? -tick : tick;

        let ratio: BigInt =
            (absTick & 0x1) != 0
                ? hexToBigInt("0xfffcb933bd6fad37aa2d162d1a594001")
                : hexToBigInt("0x100000000000000000000000000000000");
        if ((absTick & 0x2) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xfff97272373d413259a46990580e213a"),
            );
        if ((absTick & 0x4) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xfff2e50f5f656932ef12357cf3c7fdcc"),
            );
        if ((absTick & 0x8) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xffe5caca7e10e4e61c3624eaa0941cd0"),
            );
        if ((absTick & 0x10) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xffcb9843d60f6159c9db58835c926644"),
            );
        if ((absTick & 0x20) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xff973b41fa98c081472e6896dfb254c0"),
            );
        if ((absTick & 0x40) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xff2ea16466c96a3843ec78b326b52861"),
            );
        if ((absTick & 0x80) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xfe5dee046a99a2a811c461f1969c3053"),
            );
        if ((absTick & 0x100) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xfcbe86c7900a88aedcffc83b479aa3a4"),
            );
        if ((absTick & 0x200) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xf987a7253ac413176f2b074cf7815e54"),
            );
        if ((absTick & 0x400) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xf3392b0822b70005940c7a398e4b70f3"),
            );
        if ((absTick & 0x800) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xe7159475a2c29b7443b29c7fa6e889d9"),
            );
        if ((absTick & 0x1000) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xd097f3bdfd2022b8845ad8f792aa5825"),
            );
        if ((absTick & 0x2000) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0xa9f746462d870fdf8a65dc1f90e061e5"),
            );
        if ((absTick & 0x4000) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0x70d869a156d2a1b890bb3df62baf32f7"),
            );
        if ((absTick & 0x8000) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0x31be135f97d08fd981231505542fcfa6"),
            );
        if ((absTick & 0x10000) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0x9aa508b5b7a84e1c677de54f3e99bc9"),
            );
        if ((absTick & 0x20000) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0x5d6af8dedb81196699c329225ee604"),
            );
        if ((absTick & 0x40000) != 0)
            ratio = mulShift(
                ratio,
                hexToBigInt("0x2216e584f5fa1ea926041bedfe98"),
            );
        if ((absTick & 0x80000) != 0)
            ratio = mulShift(ratio, hexToBigInt("0x48a170391f7dc42444e8fa2"));
        if (tick > 0) ratio = BI_MAX_U256.div(ratio);

        return ratio
            .div(BigInt.fromI32(2).pow(32))
            .plus(
                ratio.mod(BigInt.fromI32(2).pow(32)).gt(BigInt.zero())
                    ? BigInt.fromI32(1)
                    : BigInt.zero(),
            );
    }
}

export abstract class SqrtPriceMath {
    public static getAmount0Delta(
        sqrtRatioAX96: BigInt,
        sqrtRatioBX96: BigInt,
        liquidity: BigInt,
        roundUp: boolean,
    ): BigInt {
        if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
            const temp = sqrtRatioAX96;
            sqrtRatioAX96 = sqrtRatioBX96;
            sqrtRatioBX96 = temp;
        }

        const numerator1 = liquidity.leftShift(96);
        const numerator2 = sqrtRatioBX96.minus(sqrtRatioAX96);

        return roundUp
            ? FullMath.mulDivRoundingUp(
                  FullMath.mulDivRoundingUp(
                      numerator1,
                      numerator2,
                      sqrtRatioBX96,
                  ),
                  BI_1,
                  sqrtRatioAX96,
              )
            : numerator1
                  .times(numerator2)
                  .div(sqrtRatioBX96)
                  .div(sqrtRatioAX96);
    }

    public static getAmount1Delta(
        sqrtRatioAX96: BigInt,
        sqrtRatioBX96: BigInt,
        liquidity: BigInt,
        roundUp: boolean,
    ): BigInt {
        if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
            const temp = sqrtRatioAX96;
            sqrtRatioAX96 = sqrtRatioBX96;
            sqrtRatioBX96 = temp;
        }

        const difference = sqrtRatioBX96.minus(sqrtRatioAX96);

        return roundUp
            ? FullMath.mulDivRoundingUp(liquidity, difference, BI_Q96)
            : liquidity.times(difference).div(BI_Q96);
    }
}

export function hexToBigInt(hex: string): BigInt {
    if (hex.startsWith("0x")) {
        hex = hex.slice(2);
    }
    let result = BigInt.zero();
    for (let i = 0; i < hex.length; i++) {
        result = result
            .times(BigInt.fromI32(16))
            .plus(BigInt.fromI32(parseInt(hex.charAt(i), 16) as i32));
    }
    return result;
}

export abstract class FullMath {
    public static mulDivRoundingUp(
        a: BigInt,
        b: BigInt,
        denominator: BigInt,
    ): BigInt {
        const product = a.times(b);
        let result = product.div(denominator);
        if (!product.mod(denominator).isZero()) result = result.plus(BI_1);
        return result;
    }
}

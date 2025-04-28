import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { BD_0 } from "./commons";

const MIN_TICK = -887272;
const MAX_TICK = 887272;

const BI_2 = BigInt.fromI32(2);
const CARBON_UNIT = BigInt.fromI32(2).pow(48);

const BD_1 = BigDecimal.fromString("1");

export class EncodedOrder {
    y: BigInt;
    z: BigInt;
    A: BigInt;
    B: BigInt;

    constructor(y: BigInt, z: BigInt, A: BigInt, B: BigInt) {
        this.y = y;
        this.z = z;
        this.A = A;
        this.B = B;
    }
}

function decodeFloat(value: BigInt): BigDecimal {
    if (value.isZero()) return BD_0;
    const numerator = value.mod(CARBON_UNIT);
    const denominator = BI_2.pow(value.div(CARBON_UNIT).toI32() as u8);
    const out = numerator.div(denominator);
    return BigDecimal.fromString(out.toString()).truncate(6);
}

function decodeRate(decodedFloat: BigDecimal): BigDecimal {
    return decodedFloat.div(BigDecimal.fromString(CARBON_UNIT.toString()));
}

export class DecodedOrder {
    lowestRate: BigDecimal;
    highestRate: BigDecimal;
    liquidity: BigInt;
    active: bool;

    constructor(
        lowestRate: BigDecimal,
        highestRate: BigDecimal,
        liquidity: BigInt,
        active: bool,
    ) {
        this.lowestRate = lowestRate;
        this.highestRate = highestRate;
        this.liquidity = liquidity;
        this.active = active;
    }
}

function decodeOrder(order: EncodedOrder): DecodedOrder {
    const A = decodeFloat(order.A);
    const B = decodeFloat(order.B);
    const lowestRate = decodeRate(B);
    const highestRate = decodeRate(B.plus(A));
    const inactive = (order.A.isZero() && order.B.isZero()) || order.y.isZero();
    return new DecodedOrder(lowestRate, highestRate, order.y, !inactive);
}

export function calculateImpliedTick(decodedRate: BigDecimal): i32 {
    const float = parseFloat(decodedRate.toString());
    if (float == 0) return MIN_TICK;
    const tick = NativeMath.log(float) / NativeMath.log(1.0001);
    return NativeMath.round(tick) as i32;
}

function calculateLConstant(z: BigInt, A: BigInt): BigInt {
    let decodedA = decodeFloat(A);

    return BigInt.fromString(
        BigDecimal.fromString(z.toString())
            .div(decodedA.equals(BD_0) ? BD_1 : decodedA)
            .truncate(0)
            .toString(),
    );
}

export class UniV3Order {
    y: BigInt;
    z: BigInt;
    A: BigInt;
    B: BigInt;

    lowerTick: i32;
    upperTick: i32;
    liquidity: BigInt;
    tokenTvl: BigInt;
    active: bool;

    constructor(
        y: BigInt,
        z: BigInt,
        A: BigInt,
        B: BigInt,
        lowerTick: i32,
        upperTick: i32,
        liquidity: BigInt,
        tokenTvl: BigInt,
        active: bool,
    ) {
        this.y = y;
        this.z = z;
        this.A = A;
        this.B = B;
        this.lowerTick = lowerTick;
        this.upperTick = upperTick;
        this.liquidity = liquidity;
        this.tokenTvl = tokenTvl;
        this.active = active;
    }
}

export function decodeOrderToUniV3(
    order: EncodedOrder,
    isZero: bool,
): UniV3Order {
    const decodedOrder = decodeOrder(order);

    let lowerTick: i32 = 0;
    let upperTick: i32 = 0;

    if (isZero) {
        lowerTick = calculateImpliedTick(decodedOrder.lowestRate);
        upperTick = calculateImpliedTick(decodedOrder.highestRate);
    } else {
        // For buy orders, invert the prices
        const invertedPriceLow = decodedOrder.highestRate.equals(BD_0)
            ? BD_0
            : BD_1.div(decodedOrder.highestRate);
        const invertedPriceHigh = decodedOrder.lowestRate.equals(BD_0)
            ? BD_0
            : BD_1.div(decodedOrder.lowestRate);

        lowerTick = calculateImpliedTick(invertedPriceLow);
        upperTick = calculateImpliedTick(invertedPriceHigh);
    }

    if (lowerTick < MIN_TICK) lowerTick = MIN_TICK;
    if (upperTick > MAX_TICK) upperTick = MAX_TICK;
    if (lowerTick == upperTick) upperTick = lowerTick + 1;

    return new UniV3Order(
        order.y,
        order.z,
        order.A,
        order.B,
        lowerTick,
        upperTick,
        calculateLConstant(order.z, order.A),
        order.y,
        decodedOrder.active,
    );
}

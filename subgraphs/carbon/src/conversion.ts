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

    constructor(
        lowestRate: BigDecimal,
        highestRate: BigDecimal,
        liquidity: BigInt,
    ) {
        this.lowestRate = lowestRate;
        this.highestRate = highestRate;
        this.liquidity = liquidity;
    }
}

function decodeOrder(order: EncodedOrder): DecodedOrder | null {
    if (order.A.isZero() && order.B.isZero()) return null;

    const A = decodeFloat(order.A);
    const B = decodeRate(decodeFloat(order.B));

    return new DecodedOrder(decodeRate(B), decodeRate(B.plus(A)), order.y);
}

export function calculateImpliedTick(decodedRate: BigDecimal): i32 {
    const float = parseFloat(decodedRate.toString());
    const tick = NativeMath.log(float) / NativeMath.log(1.0001);
    return NativeMath.round(tick) as i32;
}

function calculateLConstant(order: EncodedOrder): BigInt {
    const decodedA = decodeFloat(order.A);
    const A = decodedA.equals(BD_0) ? BD_1 : decodedA;
    const z = BigDecimal.fromString(order.z.toString());
    const L = z.div(A);
    return BigInt.fromString(L.truncate(0).toString());
}

export class UniV3Order {
    lowerTick: i32;
    upperTick: i32;
    liquidity: BigInt;
    tokenTvl: BigInt;

    constructor(
        lowerTick: i32,
        upperTick: i32,
        liquidity: BigInt,
        tokenTvl: BigInt,
    ) {
        this.lowerTick = lowerTick;
        this.upperTick = upperTick;
        this.liquidity = liquidity;
        this.tokenTvl = tokenTvl;
    }
}

export function decodeOrderToUniV3(
    order: EncodedOrder,
    isZero: bool,
): UniV3Order | null {
    const decodedOrder = decodeOrder(order);
    if (decodedOrder === null) return null;

    let lowerTick: i32 = 0;
    let upperTick: i32 = 0;

    if (isZero) {
        lowerTick = calculateImpliedTick(decodedOrder.lowestRate);
        upperTick = calculateImpliedTick(decodedOrder.highestRate);
    } else {
        // For buy orders, invert the prices
        const invertedPriceLow = BD_1.div(decodedOrder.highestRate);
        const invertedPriceHigh = BD_1.div(decodedOrder.lowestRate);

        lowerTick = calculateImpliedTick(invertedPriceLow);
        upperTick = calculateImpliedTick(invertedPriceHigh);
    }

    if (lowerTick < MIN_TICK || upperTick > MAX_TICK) return null;
    if (lowerTick == upperTick) upperTick = lowerTick + 1;

    return new UniV3Order(
        lowerTick,
        upperTick,
        calculateLConstant(order),
        order.y,
    );
}

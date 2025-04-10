import { BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { BD_0 } from "./commons";

const MIN_TICK = -887272;
const MAX_TICK = 887272;
const MAX_LIQ = BigInt.fromUnsignedBytes(
    Bytes.fromHexString("0xffffffffffffffffffffffffffffffff"),
);

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

function decodeOrder(order: EncodedOrder): DecodedOrder {
    const A = decodeFloat(order.A);
    const B = decodeFloat(order.B);
    return new DecodedOrder(decodeRate(B), decodeRate(B.plus(A)), order.y);
}

export function calculateImpliedTick(
    decodedRate: BigDecimal,
    roundUp: boolean,
): i32 {
    const float = parseFloat(decodedRate.toString());
    if (float === 0.0) return MIN_TICK - 1; // invalid rate/tick
    const tick = NativeMath.log(float) / NativeMath.log(1.0001);
    return (roundUp ? NativeMath.ceil(tick) : NativeMath.floor(tick)) as i32;
}

function calculateLConstant(order: EncodedOrder): BigInt {
    if (order.A.isZero()) return MAX_LIQ;
    const z = BigDecimal.fromString(order.z.toString());
    const L = z.div(decodeFloat(order.A));
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

    const priceLow = decodedOrder.lowestRate;
    const priceHigh = decodedOrder.highestRate;

    if (priceLow.equals(BD_0) || priceHigh.equals(BD_0)) return null;

    let lowerTick: i32 = 0;
    let upperTick: i32 = 0;

    if (isZero) {
        lowerTick = calculateImpliedTick(priceLow, false);
        upperTick = calculateImpliedTick(priceHigh, true);
    } else {
        // For buy orders, invert the prices
        const invertedPriceLow = BD_1.div(priceHigh);
        const invertedPriceHigh = BD_1.div(priceLow);

        lowerTick = calculateImpliedTick(invertedPriceLow, false);
        upperTick = calculateImpliedTick(invertedPriceHigh, true);
    }

    log.warning(
        "y: {} - z: {} - A: {} - B: {} - price low: {} - price high: {} - lower tick: {} - upper tick: {}",
        [
            order.y.toString(),
            order.z.toString(),
            order.A.toString(),
            order.B.toString(),
            priceLow.toString(),
            priceHigh.toString(),
            lowerTick.toString(),
            upperTick.toString(),
        ],
    );

    if (lowerTick < MIN_TICK || upperTick > MAX_TICK) return null;

    return new UniV3Order(
        lowerTick,
        upperTick,
        calculateLConstant(order),
        order.y,
    );
}

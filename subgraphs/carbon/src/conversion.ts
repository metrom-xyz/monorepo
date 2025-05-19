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
    const numerator = BigDecimal.fromString(value.mod(CARBON_UNIT).toString());
    const denominator = BigDecimal.fromString(
        BI_2.pow(value.div(CARBON_UNIT).toI32() as u8).toString(),
    );
    return numerator.div(denominator).truncate(6);
}

function decodeRate(decodedFloat: BigDecimal): BigDecimal {
    let raw = decodedFloat.div(BigDecimal.fromString(CARBON_UNIT.toString()));
    return raw.times(raw);
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
        BigDecimal.fromString(z.times(CARBON_UNIT).toString())
            .div(decodedA.equals(BD_0) ? BD_1 : decodedA)
            .truncate(0)
            .toString(),
    );
}

export class UniV3Order {
    encoded: EncodedOrder;
    decoded: DecodedOrder;

    lowerTick: i32;
    upperTick: i32;
    liquidity: BigInt;
    tokenTvl: BigInt;
    active: bool;

    constructor(
        encodedOrder: EncodedOrder,
        decodedOrder: DecodedOrder,
        lowerTick: i32,
        upperTick: i32,
        liquidity: BigInt,
        tokenTvl: BigInt,
        active: bool,
    ) {
        this.encoded = encodedOrder;
        this.decoded = decodedOrder;
        this.lowerTick = lowerTick;
        this.upperTick = upperTick;
        this.liquidity = liquidity;
        this.tokenTvl = tokenTvl;
        this.active = active;
    }
}

export function decodeOrderToUniV3(
    encodedOrder: EncodedOrder,
    invert: bool,
): UniV3Order {
    const decodedOrder = decodeOrder(encodedOrder);

    let ogLowestRate = decodedOrder.lowestRate;
    let ogHighestRate = decodedOrder.highestRate;

    let lowestRate = ogLowestRate;
    let highestRate = ogHighestRate;
    if (invert) {
        lowestRate = ogHighestRate.equals(BD_0)
            ? BD_0
            : BD_1.div(ogHighestRate);
        highestRate = ogLowestRate.equals(BD_0) ? BD_0 : BD_1.div(ogLowestRate);
    }

    let lowerTick = calculateImpliedTick(lowestRate);
    let upperTick = calculateImpliedTick(highestRate);

    if (lowerTick === upperTick) {
        if (upperTick === MAX_TICK) lowerTick -= 1;
        else upperTick += 1;
    }

    return new UniV3Order(
        encodedOrder,
        decodedOrder,
        lowerTick,
        upperTick,
        calculateLConstant(encodedOrder.z, encodedOrder.A),
        encodedOrder.y,
        decodedOrder.active,
    );
}

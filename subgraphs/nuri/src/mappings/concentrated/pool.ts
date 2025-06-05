import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    crypto,
} from "@graphprotocol/graph-ts";
import {
    Initialize,
    Swap,
    Mint,
    Burn,
} from "../../../generated/templates/ConcentratedPool/ConcentratedPool";
import {
    ConcentratedPosition,
    ConcentratedPool,
    ConcentratedLiquidityChange,
    SwapChange,
} from "../../../generated/schema";
import {
    BD_Q192,
    BI_0,
    exponentToBigDecimal,
    getEventId,
    getFeeAdjustedAmount,
    getOrCreateTick,
    getTokenOrThrow,
} from "../../commons";
import { NON_FUNGIBLE_POSITION_MANAGER_ADDRESS } from "../../addresses";

function getPrice(
    sqrtPriceX96: BigInt,
    token0Id: Bytes,
    token1Id: Bytes,
): BigDecimal {
    let token0 = getTokenOrThrow(changetype<Address>(token0Id));
    let token1 = getTokenOrThrow(changetype<Address>(token1Id));

    return sqrtPriceX96
        .times(sqrtPriceX96)
        .toBigDecimal()
        .div(BD_Q192)
        .times(exponentToBigDecimal(token0.decimals))
        .div(exponentToBigDecimal(token1.decimals));
}

function getPoolOrThrow(address: Address): ConcentratedPool {
    let pool = ConcentratedPool.load(address);
    if (pool !== null) return pool;

    throw new Error(
        `Could not find concentrated pool with address ${address.toHex()}`,
    );
}

export function handleInitialize(event: Initialize): void {
    let pool = getPoolOrThrow(event.address);
    pool.tick = event.params.tick;
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.save();
}

export function handleSwap(event: Swap): void {
    let pool = getPoolOrThrow(event.address);
    pool.liquidity = event.params.liquidity;
    pool.token0Tvl = pool.token0Tvl.plus(
        getFeeAdjustedAmount(event.params.amount0, pool.fee),
    );
    pool.token1Tvl = pool.token1Tvl.plus(
        getFeeAdjustedAmount(event.params.amount1, pool.fee),
    );
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);

    if (
        event.params.sqrtPriceX96.notEqual(pool.sqrtPriceX96) ||
        event.params.tick != pool.tick
    ) {
        let swapChange = new SwapChange(getEventId(event));
        swapChange.timestamp = event.block.timestamp;
        swapChange.blockNumber = event.block.number;
        swapChange.pool = pool.id;
        swapChange.tick = event.params.tick;
        swapChange.sqrtPriceX96 = event.params.sqrtPriceX96;
        swapChange.save();
    }

    pool.tick = event.params.tick;
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.save();
}

function getDirectPositionId(
    poolAddress: Address,
    owner: Address,
    lowerTick: i32,
    upperTick: i32,
): Bytes {
    return Bytes.fromByteArray(
        crypto.keccak256(
            poolAddress
                .concat(owner)
                .concat(Bytes.fromByteArray(Bytes.fromI32(lowerTick)))
                .concat(Bytes.fromByteArray(Bytes.fromI32(upperTick))),
        ),
    );
}

function getOrCreateDirectPosition(
    poolAddress: Address,
    owner: Address,
    lowerTick: i32,
    upperTick: i32,
): ConcentratedPosition {
    let id = getDirectPositionId(poolAddress, owner, lowerTick, upperTick);
    let position = ConcentratedPosition.load(id);
    if (position != null) return position;

    let pool = getPoolOrThrow(poolAddress);

    position = new ConcentratedPosition(id);
    position.owner = owner;
    position.lowerTick = lowerTick;
    position.upperTick = upperTick;
    position.liquidity = BI_0;
    position.direct = true;
    position.pool = pool.id;
    position.save();

    return position;
}

function getDirectPositionOrThrow(
    poolAddress: Address,
    owner: Address,
    lowerTick: i32,
    upperTick: i32,
): ConcentratedPosition {
    let position = ConcentratedPosition.load(
        getDirectPositionId(poolAddress, owner, lowerTick, upperTick),
    );
    if (position != null) return position;

    throw new Error(
        `Could not find direct position with owner ${owner.toHex()} in range ${lowerTick.toString()} to ${upperTick.toString()}`,
    );
}

export function handleMint(event: Mint): void {
    let pool = getPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);

    if (
        event.params.tickLower <= pool.tick &&
        event.params.tickUpper > pool.tick
    )
        pool.liquidity = pool.liquidity.plus(event.params.amount);

    pool.save();

    let lowerTick = getOrCreateTick(pool.id, event.params.tickLower);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(
        event.params.amount,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(event.params.amount);
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.tickUpper);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(
        event.params.amount,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.minus(event.params.amount);
    upperTick.save();

    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

    if (!event.params.amount.isZero()) {
        let position = getOrCreateDirectPosition(
            event.address,
            event.params.owner,
            event.params.tickLower,
            event.params.tickUpper,
        );

        position.liquidity = position.liquidity.plus(event.params.amount);
        position.save();

        let liquidityChange = new ConcentratedLiquidityChange(
            getEventId(event),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.amount;
        liquidityChange.pool = position.pool;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleBurn(event: Burn): void {
    let pool = getPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.minus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.amount1);

    if (
        event.params.tickLower <= pool.tick &&
        event.params.tickUpper > pool.tick
    )
        pool.liquidity = pool.liquidity.minus(event.params.amount);

    pool.save();

    let lowerTick = getOrCreateTick(pool.id, event.params.tickLower);
    lowerTick.liquidityGross = lowerTick.liquidityGross.minus(
        event.params.amount,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.minus(event.params.amount);
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.tickUpper);
    upperTick.liquidityGross = upperTick.liquidityGross.minus(
        event.params.amount,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.plus(event.params.amount);
    upperTick.save();

    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

    if (!event.params.amount.isZero()) {
        let position = getDirectPositionOrThrow(
            event.address,
            event.params.owner,
            event.params.tickLower,
            event.params.tickUpper,
        );
        position.liquidity = position.liquidity.minus(event.params.amount);
        position.save();

        let liquidityChange = new ConcentratedLiquidityChange(
            getEventId(event),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.amount.neg();
        liquidityChange.pool = position.pool;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

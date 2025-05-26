import { Address, Bytes, crypto } from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap as SwapEvent,
    Mint as MintEvent,
    Burn as BurnEvent,
} from "../../generated/templates/Pool/Pool";
import {
    Position,
    Pool,
    TickChange,
    LiquidityChange,
    PriceChange,
} from "../../generated/schema";
import {
    BI_0,
    getEventId,
    getFeeAdjustedAmount,
    getOrCreateTick,
    getPoolOrThrow,
    getPrice,
} from "../commons";
import { NON_FUNGIBLE_POSITION_MANAGER_ADDRESS } from "../addresses";

export function handleInitialize(event: InitializeEvent): void {
    let pool = Pool.load(event.address);
    if (pool === null)
        throw new Error(
            `Could not find pool with address ${event.address.toHexString()}`,
        );

    pool.tick = event.params.tick;
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);
    pool.save();
}

export function handleSwap(event: SwapEvent): void {
    let pool = getPoolOrThrow(event.address);
    pool.liquidity = event.params.liquidity;
    pool.token0Tvl = pool.token0Tvl.plus(
        getFeeAdjustedAmount(event.params.amount0, pool.fee),
    );
    pool.token1Tvl = pool.token1Tvl.plus(
        getFeeAdjustedAmount(event.params.amount1, pool.fee),
    );

    let newPrice = getPrice(
        event.params.sqrtPriceX96,
        pool.token0,
        pool.token1,
    );
    if (newPrice != pool.price) {
        let priceChange = new PriceChange(getEventId(event));
        priceChange.timestamp = event.block.timestamp;
        priceChange.blockNumber = event.block.number;
        priceChange.pool = pool.id;
        priceChange.newPrice = newPrice;
        priceChange.save();

        pool.price = newPrice;
    }

    let newTick = event.params.tick;
    if (newTick != pool.tick) {
        let tickChange = new TickChange(getEventId(event));
        tickChange.timestamp = event.block.timestamp;
        tickChange.blockNumber = event.block.number;
        tickChange.pool = pool.id;
        tickChange.newTick = newTick;
        tickChange.save();

        pool.tick = newTick;
    }

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
                .concat(Bytes.fromI32(lowerTick))
                .concat(Bytes.fromI32(upperTick)),
        ),
    );
}

function getOrCreateDirectPosition(
    poolAddress: Address,
    owner: Address,
    lowerTick: i32,
    upperTick: i32,
): Position {
    let id = getDirectPositionId(poolAddress, owner, lowerTick, upperTick);
    let position = Position.load(id);
    if (position != null) return position;

    let pool = getPoolOrThrow(poolAddress);

    position = new Position(id);
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
): Position {
    let position = Position.load(
        getDirectPositionId(poolAddress, owner, lowerTick, upperTick),
    );
    if (position != null) return position;

    throw new Error(
        `Could not find direct position with owner ${owner.toHex()} in range ${lowerTick.toString()} to ${upperTick.toString()}`,
    );
}

export function handleMint(event: MintEvent): void {
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

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.amount;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleBurn(event: BurnEvent): void {
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

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.amount.neg();
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

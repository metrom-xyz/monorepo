import {
    Address,
    BigInt,
    Bytes,
    crypto,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap1 as SwapEventV1_0,
    Swap as SwapEventV1_2,
    Mint as MintEvent,
    Burn as BurnEventV1_2,
    Burn1 as BurnEventV1_0,
    Fee as FeeEvent,
} from "../../generated/templates/Pool/Pool";
import {
    Position,
    Pool,
    LiquidityChange,
    SwapChange,
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
    pool.price = getPrice(event.params.price, pool.token0, pool.token1);
    pool.sqrtPriceX96 = event.params.price;
    pool.save();
}

export function handleFee(event: FeeEvent): void {
    let pool = getPoolOrThrow(event.address);
    pool.fee = event.params.fee;
    pool.save();
}

function handleSwap(
    pool: Pool,
    event: ethereum.Event,
    liquidity: BigInt,
    amount0: BigInt,
    amount1: BigInt,
    price: BigInt,
    tick: i32,
    fee: i32,
): void {
    pool.liquidity = liquidity;
    pool.token0Tvl = pool.token0Tvl.plus(getFeeAdjustedAmount(amount0, fee));
    pool.token1Tvl = pool.token1Tvl.plus(getFeeAdjustedAmount(amount1, fee));
    pool.price = getPrice(price, pool.token0, pool.token1);

    if (price.notEqual(pool.sqrtPriceX96) || tick != pool.tick) {
        let swapChange = new SwapChange(getEventId(event));
        swapChange.timestamp = event.block.timestamp;
        swapChange.blockNumber = event.block.number;
        swapChange.pool = pool.id;
        swapChange.tick = tick;
        swapChange.sqrtPriceX96 = price;
        swapChange.save();
    }

    if (fee !== -1) pool.fee = fee;
    pool.tick = tick;
    pool.sqrtPriceX96 = price;
    pool.save();
}

export function handleSwapV1_0(event: SwapEventV1_0): void {
    const pool = getPoolOrThrow(event.address);
    handleSwap(
        pool,
        event,
        event.params.liquidity,
        event.params.amount0,
        event.params.amount1,
        event.params.price,
        event.params.tick,
        pool.fee,
    );
}

export function handleSwapV1_2(event: SwapEventV1_2): void {
    const pool = getPoolOrThrow(event.address);

    handleSwap(
        pool,
        event,
        event.params.liquidity,
        event.params.amount0,
        event.params.amount1,
        event.params.price,
        event.params.tick,
        event.params.overrideFee > 0 ? event.params.overrideFee : pool.fee,
    );
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
        event.params.bottomTick <= pool.tick &&
        event.params.topTick > pool.tick
    )
        pool.liquidity = pool.liquidity.plus(event.params.liquidityAmount);

    pool.save();

    let lowerTick = getOrCreateTick(pool.id, event.params.bottomTick);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(
        event.params.liquidityAmount,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(
        event.params.liquidityAmount,
    );
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.topTick);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(
        event.params.liquidityAmount,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.minus(
        event.params.liquidityAmount,
    );
    upperTick.save();

    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

    if (!event.params.liquidityAmount.isZero()) {
        let position = getOrCreateDirectPosition(
            event.address,
            event.params.owner,
            event.params.bottomTick,
            event.params.topTick,
        );

        position.liquidity = position.liquidity.plus(
            event.params.liquidityAmount,
        );
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.liquidityAmount;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

function handleBurn(
    poolAddress: Address,
    event: ethereum.Event,
    owner: Address,
    liquidity: BigInt,
    amount0: BigInt,
    amount1: BigInt,
    bottomTick: i32,
    topTick: i32,
): void {
    const pool = getPoolOrThrow(poolAddress);
    pool.token0Tvl = pool.token0Tvl.minus(amount0);
    pool.token1Tvl = pool.token1Tvl.minus(amount1);

    if (bottomTick <= pool.tick && topTick > pool.tick)
        pool.liquidity = pool.liquidity.minus(liquidity);

    pool.save();

    const lowerTick = getOrCreateTick(pool.id, bottomTick);
    lowerTick.liquidityGross = lowerTick.liquidityGross.minus(liquidity);
    lowerTick.liquidityNet = lowerTick.liquidityNet.minus(liquidity);
    lowerTick.save();

    const upperTick = getOrCreateTick(pool.id, topTick);
    upperTick.liquidityGross = upperTick.liquidityGross.minus(liquidity);
    upperTick.liquidityNet = upperTick.liquidityNet.plus(liquidity);
    upperTick.save();

    if (NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

    if (!liquidity.isZero()) {
        const position = getDirectPositionOrThrow(
            event.address,
            owner,
            bottomTick,
            topTick,
        );

        position.liquidity = position.liquidity.minus(liquidity);
        position.save();

        const liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = liquidity.neg();
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleBurnV1_0(event: BurnEventV1_0): void {
    handleBurn(
        event.address,
        event,
        event.params.owner,
        event.params.liquidityAmount,
        event.params.amount0,
        event.params.amount1,
        event.params.bottomTick,
        event.params.topTick,
    );
}

export function handleBurnV1_2(event: BurnEventV1_2): void {
    handleBurn(
        event.address,
        event,
        event.params.owner,
        event.params.liquidityAmount,
        event.params.amount0,
        event.params.amount1,
        event.params.bottomTick,
        event.params.topTick,
    );
}

import {
    Address,
    BigInt,
    Bytes,
    crypto,
    dataSource,
} from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap as SwapEvent,
    Mint as MintEvent,
    Burn as BurnEvent,
    Fee as FeeEvent,
} from "../../generated/templates/Pool/Pool";
import { Position, Pool } from "../../generated/schema";
import {
    BI_0,
    createBaseEvent,
    getPoolOrThrow,
    getTokenOrThrow,
    sqrtPriceToTokenPrices,
} from "../commons";
import { NON_FUNGIBLE_POSITION_MANAGER_ADDRESS } from "../addresses";

export function handleInitialize(event: InitializeEvent): void {
    let pool = Pool.load(event.address);
    if (pool === null)
        throw new Error(
            `Could not find pool in block with address ${event.address.toHexString()}`,
        );

    let context = dataSource.context();
    let prices = sqrtPriceToTokenPrices(
        event.params.price,
        context.getBigInt("token0Decimals"),
        context.getBigInt("token1Decimals"),
    );
    pool.token0Price = prices[0];
    pool.token1Price = prices[1];
    pool.tick = BigInt.fromI32(event.params.tick);
    pool.save();
}

export function handleFee(event: FeeEvent): void {
    let pool = getPoolOrThrow(event.address);
    pool.fee = BigInt.fromU32(event.params.fee);
    pool.save();
}

export function handleSwap(event: SwapEvent): void {
    let pool = getPoolOrThrow(event.address);

    let newTick = BigInt.fromI32(event.params.tick);
    if (newTick != pool.tick) {
        let tickMovingSwap = createBaseEvent(event, pool.id);
        tickMovingSwap.newTick = newTick;
        tickMovingSwap.save();
    }

    let token0 = getTokenOrThrow(Address.fromBytes(pool.token0));
    let token1 = getTokenOrThrow(Address.fromBytes(pool.token1));

    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    let prices = sqrtPriceToTokenPrices(
        event.params.price,
        token0.decimals,
        token1.decimals,
    );
    pool.token0Price = prices[0];
    pool.token1Price = prices[1];
    pool.tick = newTick;
    pool.save();
}

function getDirectPositionId(
    poolAddress: Address,
    owner: Address,
    lowerTick: BigInt,
    upperTick: BigInt,
): Bytes {
    return Bytes.fromByteArray(
        crypto.keccak256(
            poolAddress
                .concat(owner)
                .concat(Bytes.fromByteArray(Bytes.fromBigInt(lowerTick)))
                .concat(Bytes.fromByteArray(Bytes.fromBigInt(upperTick))),
        ),
    );
}

function getOrCreateDirectPosition(
    poolAddress: Address,
    owner: Address,
    lowerTick: BigInt,
    upperTick: BigInt,
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
    lowerTick: BigInt,
    upperTick: BigInt,
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
    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

    let pool = getPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    pool.save();

    let position = getOrCreateDirectPosition(
        event.address,
        event.params.owner,
        BigInt.fromI32(event.params.bottomTick),
        BigInt.fromI32(event.params.topTick),
    );
    position.liquidity = position.liquidity.plus(event.params.liquidityAmount);
    position.save();

    if (!event.params.liquidityAmount.isZero()) {
        let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
        nonZeroLiquidityChange.liquidityDelta = event.params.liquidityAmount;
        nonZeroLiquidityChange.position = position.id;
        nonZeroLiquidityChange.save();
    }
}

export function handleBurn(event: BurnEvent): void {
    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

    let pool = getPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.minus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.amount1);
    pool.save();

    let position = getDirectPositionOrThrow(
        event.address,
        event.params.owner,
        BigInt.fromI32(event.params.bottomTick),
        BigInt.fromI32(event.params.topTick),
    );
    position.liquidity = position.liquidity.minus(event.params.liquidityAmount);
    position.save();

    if (!event.params.liquidityAmount.isZero()) {
        let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
        nonZeroLiquidityChange.liquidityDelta =
            event.params.liquidityAmount.neg();
        nonZeroLiquidityChange.position = position.id;
        nonZeroLiquidityChange.save();
    }
}

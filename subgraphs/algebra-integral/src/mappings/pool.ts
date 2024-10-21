import { Address, BigInt, Bytes, crypto } from "@graphprotocol/graph-ts";
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
    convertTokenToDecimal,
    createBaseEvent,
    getPoolOrThrow,
    getTokenOrThrow,
} from "../commons";
import { NON_FUNGIBLE_POSITION_MANAGER_ADDRESS } from "../addresses";

export function handleInitialize(event: InitializeEvent): void {
    let pool = Pool.load(event.address);
    if (pool === null)
        throw new Error(
            `Could not find pool with address ${event.address.toHexString()}`,
        );

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

    let amount0 = convertTokenToDecimal(
        event.params.amount0,
        Address.fromBytes(token0.id),
    );
    let amount1 = convertTokenToDecimal(
        event.params.amount1,
        Address.fromBytes(token1.id),
    );

    pool.token0Tvl = pool.token0Tvl.plus(amount0);
    pool.token1Tvl = pool.token1Tvl.plus(amount1);
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
    let pool = getPoolOrThrow(event.address);

    let amount0 = convertTokenToDecimal(
        event.params.amount0,
        Address.fromBytes(pool.token0),
    );
    let amount1 = convertTokenToDecimal(
        event.params.amount1,
        Address.fromBytes(pool.token1),
    );

    pool.token0Tvl = pool.token0Tvl.plus(amount0);
    pool.token1Tvl = pool.token1Tvl.plus(amount1);
    pool.save();

    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

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
    let pool = getPoolOrThrow(event.address);

    let amount0 = convertTokenToDecimal(
        event.params.amount0,
        Address.fromBytes(pool.token0),
    );
    let amount1 = convertTokenToDecimal(
        event.params.amount1,
        Address.fromBytes(pool.token1),
    );

    pool.token0Tvl = pool.token0Tvl.minus(amount0);
    pool.token1Tvl = pool.token1Tvl.minus(amount1);
    pool.save();

    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

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

import { Address, BigInt, Bytes, crypto } from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap as SwapEvent,
    Mint as MintEvent,
    Burn as BurnEvent,
} from "../../generated/templates/Pool/Pool";
import { Position, Pool } from "../../generated/schema";
import { createBaseEvent, getPoolOrThrow } from "../commons";
import { NON_FUNGIBLE_POSITION_MANAGER_ADDRESS } from "../addresses";

export function handleInitialize(event: InitializeEvent): void {
    let pool = Pool.load(event.address);
    if (pool === null)
        throw new Error(
            `Could not find pool in block with address ${event.address.toHexString()}`,
        );

    pool.tick = BigInt.fromI32(event.params.tick);
    pool.save();
}

export function handleSwap(event: SwapEvent): void {
    let pool = getPoolOrThrow(event.address);

    let newTick = BigInt.fromI32(event.params.tick);
    if (newTick == pool.tick) return;

    pool.tick = newTick;
    pool.liquidity = event.params.liquidity;
    pool.save();

    let tickMovingSwap = createBaseEvent(event, pool.id);
    tickMovingSwap.newTick = newTick;
    tickMovingSwap.save();
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
    position.liquidity = BigInt.zero();
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
    if (
        event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS ||
        event.params.amount.isZero()
    )
        return;

    let position = getOrCreateDirectPosition(
        event.address,
        event.params.owner,
        BigInt.fromI32(event.params.tickLower),
        BigInt.fromI32(event.params.tickUpper),
    );
    position.liquidity = position.liquidity.plus(event.params.amount);
    position.save();

    let pool = getPoolOrThrow(Address.fromBytes(position.pool));
    if (position.lowerTick <= pool.tick && position.upperTick >= pool.tick) {
        pool.liquidity = pool.liquidity.plus(event.params.amount);
        pool.save();
    }

    let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = event.params.amount;
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}

export function handleBurn(event: BurnEvent): void {
    if (
        event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS ||
        event.params.amount.isZero()
    )
        return;

    let position = getDirectPositionOrThrow(
        event.address,
        event.params.owner,
        BigInt.fromI32(event.params.tickLower),
        BigInt.fromI32(event.params.tickUpper),
    );
    position.liquidity = position.liquidity.minus(event.params.amount);
    position.save();

    let pool = getPoolOrThrow(Address.fromBytes(position.pool));
    if (position.lowerTick <= pool.tick && position.upperTick >= pool.tick) {
        pool.liquidity = pool.liquidity.minus(event.params.amount);
        pool.save();
    }

    let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = event.params.amount.neg();
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}

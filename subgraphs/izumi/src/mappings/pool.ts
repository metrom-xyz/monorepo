import { Address, Bytes, crypto } from "@graphprotocol/graph-ts";
import {
    Swap as SwapEvent,
    Mint as MintEvent,
    Burn as BurnEvent,
} from "../../generated/templates/Pool/Pool";
import { Position, LiquidityChange } from "../../generated/schema";
import {
    BI_0,
    getEventId,
    getFeeAdjustedAmount,
    getOrCreateTick,
    getPoolOrThrow,
    updatePoolState,
} from "../commons";
import { LIQUIDITY_MANAGER_ADDRESS } from "../addresses";

export function handleSwap(event: SwapEvent): void {
    updatePoolState(
        event.block.number,
        event.block.timestamp,
        getPoolOrThrow(event.address),
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

    let lowerTick = getOrCreateTick(pool.id, event.params.leftPoint);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(
        event.params.liquidity,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(
        event.params.liquidity,
    );
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.rightPoint);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(
        event.params.liquidity,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.minus(
        event.params.liquidity,
    );
    upperTick.save();

    if (event.params.owner == LIQUIDITY_MANAGER_ADDRESS) return;

    if (!event.params.liquidity.isZero()) {
        let position = getOrCreateDirectPosition(
            event.address,
            event.params.owner,
            event.params.leftPoint,
            event.params.rightPoint,
        );

        position.liquidity = position.liquidity.plus(event.params.liquidity);
        position.save();

        let liquidityChange = new LiquidityChange(
            getEventId(event.block.number, event.logIndex),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.liquidity;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }

    updatePoolState(event.block.number, event.block.timestamp, pool);
}

export function handleBurn(event: BurnEvent): void {
    let pool = getPoolOrThrow(event.address);

    let lowerTick = getOrCreateTick(pool.id, event.params.leftPoint);
    lowerTick.liquidityGross = lowerTick.liquidityGross.minus(
        event.params.liquidity,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.minus(
        event.params.liquidity,
    );
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.rightPoint);
    upperTick.liquidityGross = upperTick.liquidityGross.minus(
        event.params.liquidity,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.plus(
        event.params.liquidity,
    );
    upperTick.save();

    if (event.params.owner == LIQUIDITY_MANAGER_ADDRESS) return;

    if (!event.params.liquidity.isZero()) {
        let position = getDirectPositionOrThrow(
            event.address,
            event.params.owner,
            event.params.leftPoint,
            event.params.rightPoint,
        );
        position.liquidity = position.liquidity.minus(event.params.liquidity);
        position.save();

        let liquidityChange = new LiquidityChange(
            getEventId(event.block.number, event.logIndex),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.liquidity.neg();
        liquidityChange.position = position.id;
        liquidityChange.save();
    }

    updatePoolState(event.block.number, event.block.timestamp, pool);
}

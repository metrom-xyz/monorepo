import { Address, BigInt, Bytes, crypto } from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap as SwapEvent,
    Mint as MintEvent,
    Burn as BurnEvent,
    Fee as FeeEvent,
} from "../../generated/templates/Pool/Pool";
import {
    Position,
    Pool,
    TickMovingSwap,
    LiquidityChange,
} from "../../generated/schema";
import {
    BI_0,
    getEventId,
    getOrCreateTick,
    getPoolOrThrow,
    getSortedPoolTokens,
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
    pool.liquidity = event.params.liquidity;

    let newTick = BigInt.fromI32(event.params.tick);
    if (newTick != pool.tick) {
        let tickMovingSwap = new TickMovingSwap(getEventId(event));
        tickMovingSwap.timestamp = event.block.timestamp;
        tickMovingSwap.blockNumber = event.block.number;
        tickMovingSwap.transactionHash = event.transaction.hash;
        tickMovingSwap.pool = pool.id;
        tickMovingSwap.newTick = newTick;
        tickMovingSwap.save();

        pool.tick = newTick;
    }

    pool.save();

    let poolTokens = getSortedPoolTokens(pool);

    poolTokens[0].tvl = poolTokens[0].tvl.plus(event.params.amount0);
    poolTokens[0].save();

    poolTokens[1].tvl = poolTokens[1].tvl.plus(event.params.amount1);
    poolTokens[1].save();
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

    if (
        pool.tick !== null &&
        BigInt.fromI32(event.params.bottomTick).le(pool.tick) &&
        BigInt.fromI32(event.params.topTick).gt(pool.tick)
    ) {
        pool.liquidity = pool.liquidity.plus(event.params.liquidityAmount);
        pool.save();
    }

    let poolTokens = getSortedPoolTokens(pool);

    poolTokens[0].tvl = poolTokens[0].tvl.plus(event.params.amount0);
    poolTokens[0].save();

    poolTokens[1].tvl = poolTokens[1].tvl.plus(event.params.amount1);
    poolTokens[1].save();

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
            BigInt.fromI32(event.params.bottomTick),
            BigInt.fromI32(event.params.topTick),
        );

        position.liquidity = position.liquidity.plus(
            event.params.liquidityAmount,
        );
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.transactionHash = event.transaction.hash;
        liquidityChange.delta = event.params.liquidityAmount;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleBurn(event: BurnEvent): void {
    let pool = getPoolOrThrow(event.address);

    if (
        pool.tick !== null &&
        BigInt.fromI32(event.params.bottomTick).le(pool.tick) &&
        BigInt.fromI32(event.params.topTick).gt(pool.tick)
    ) {
        pool.liquidity = pool.liquidity.plus(event.params.liquidityAmount);
        pool.save();
    }

    let poolTokens = getSortedPoolTokens(pool);

    poolTokens[0].tvl = poolTokens[0].tvl.minus(event.params.amount0);
    poolTokens[0].save();

    poolTokens[1].tvl = poolTokens[1].tvl.minus(event.params.amount1);
    poolTokens[1].save();

    let lowerTick = getOrCreateTick(pool.id, event.params.bottomTick);
    lowerTick.liquidityGross = lowerTick.liquidityGross.minus(
        event.params.liquidityAmount,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.minus(
        event.params.liquidityAmount,
    );
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.topTick);
    upperTick.liquidityGross = upperTick.liquidityGross.minus(
        event.params.liquidityAmount,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.plus(
        event.params.liquidityAmount,
    );
    upperTick.save();

    if (event.params.owner == NON_FUNGIBLE_POSITION_MANAGER_ADDRESS) return;

    if (!event.params.liquidityAmount.isZero()) {
        let position = getDirectPositionOrThrow(
            event.address,
            event.params.owner,
            BigInt.fromI32(event.params.bottomTick),
            BigInt.fromI32(event.params.topTick),
        );

        position.liquidity = position.liquidity.minus(
            event.params.liquidityAmount,
        );
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.transactionHash = event.transaction.hash;
        liquidityChange.delta = event.params.liquidityAmount.neg();
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

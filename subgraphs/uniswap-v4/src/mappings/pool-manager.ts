import { Address, Bytes, crypto } from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap as SwapEvent,
    ModifyLiquidity as ModifyLiquidityEvent,
} from "../../generated/PoolManager/PoolManager";
import { Position, Pool } from "../../generated/schema";
import {
    BI_0,
    BI_MINUS_1,
    getOrCreateNftPosition,
    getOrCreateTick,
    getOrCreateToken,
    getPrice,
} from "../commons";
import { POSITION_MANAGER_ADDRESS } from "../constants";
import { getAmount0, getAmount1, hexToBigInt } from "../math";

export function handleInitialize(event: InitializeEvent): void {
    const token0 = getOrCreateToken(event.params.currency0);
    if (token0 === null) {
        return;
    }

    const token1 = getOrCreateToken(event.params.currency1);
    if (token1 === null) {
        return;
    }

    const pool = new Pool(event.params.id);
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.tick = event.params.tick;
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.fee = event.params.fee;
    pool.liquidity = BI_0;
    pool.save();
}

export function handleSwap(event: SwapEvent): void {
    const pool = Pool.load(event.params.id);
    if (pool === null) return;

    const amount0 = event.params.amount0.times(BI_MINUS_1);
    const amount1 = event.params.amount1.times(BI_MINUS_1);

    pool.liquidity = event.params.liquidity;
    pool.token0Tvl = pool.token0Tvl.plus(amount0);
    pool.token1Tvl = pool.token1Tvl.plus(amount1);
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);
    pool.fee = event.params.fee;
    pool.tick = event.params.tick;
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;

    pool.save();
}

function getDirectPositionId(
    poolId: Bytes,
    owner: Address,
    lowerTick: i32,
    upperTick: i32,
    salt: Bytes,
): Bytes {
    return Bytes.fromByteArray(
        crypto.keccak256(
            poolId
                .concat(owner)
                .concat(Bytes.fromI32(lowerTick))
                .concat(Bytes.fromI32(upperTick))
                .concat(salt),
        ),
    );
}

function getOrCreateDirectPosition(
    pool: Pool,
    owner: Address,
    lowerTick: i32,
    upperTick: i32,
    salt: Bytes,
): Position {
    const id = getDirectPositionId(pool.id, owner, lowerTick, upperTick, salt);
    let position = Position.load(id);
    if (position != null) return position;

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

export function handleModifyLiquidity(event: ModifyLiquidityEvent): void {
    const pool = Pool.load(event.params.id);
    if (pool === null) return;

    pool.token0Tvl = pool.token0Tvl.plus(
        getAmount0(
            event.params.tickLower,
            event.params.tickUpper,
            pool.tick,
            event.params.liquidityDelta,
            pool.sqrtPriceX96,
        ),
    );
    pool.token1Tvl = pool.token1Tvl.plus(
        getAmount1(
            event.params.tickLower,
            event.params.tickUpper,
            pool.tick,
            event.params.liquidityDelta,
            pool.sqrtPriceX96,
        ),
    );

    if (
        event.params.tickLower <= pool.tick &&
        event.params.tickUpper > pool.tick
    )
        pool.liquidity = pool.liquidity.plus(event.params.liquidityDelta);

    pool.save();

    const lowerTick = getOrCreateTick(pool.id, event.params.tickLower);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(
        event.params.liquidityDelta,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(
        event.params.liquidityDelta,
    );
    lowerTick.save();

    const upperTick = getOrCreateTick(pool.id, event.params.tickUpper);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(
        event.params.liquidityDelta,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.minus(
        event.params.liquidityDelta,
    );
    upperTick.save();

    if (event.params.liquidityDelta.isZero()) return;

    if (event.params.sender == POSITION_MANAGER_ADDRESS) {
        const position = getOrCreateNftPosition(
            pool,
            hexToBigInt(event.params.salt.toHexString()),
        );
        position.pool = pool.id;
        position.lowerTick = event.params.tickLower;
        position.upperTick = event.params.tickUpper;
        position.liquidity = position.liquidity.plus(
            event.params.liquidityDelta,
        );
        position.save();
    } else {
        const position = getOrCreateDirectPosition(
            pool,
            event.params.sender,
            event.params.tickLower,
            event.params.tickUpper,
            event.params.salt,
        );

        position.liquidity = position.liquidity.plus(
            event.params.liquidityDelta,
        );
        position.save();
    }
}

import { log } from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap as SwapEvent,
    ModifyLiquidity as ModifyLiquidityEvent,
} from "../../generated/PoolManager/PoolManager";
import {
    Pool,
    SwapChange,
    LiquidityChange,
    Position,
    PoolManagerContract,
} from "../../generated/schema";
import {
    BI_0,
    getEventId,
    getOrCreateToken,
    getPrice,
    getPositionId,
    getOrCreateTick,
    ZERO_ADDRESS,
    BD_0,
    BI_1,
} from "../commons";
import { POOL_MANAGER_ADDRESS } from "../addresses";
import { getAmount0, getAmount1 } from "../utils/liquidityMath/liquidityAmounts";

export function handleInitialize(event: InitializeEvent): void {
    // Create tokens
    let token0 = getOrCreateToken(event.params.currency0);
    if (token0 === null) {
        log.warning(
            "Could not correctly resolve currency 0 at address {}, skipping pool indexing",
            [event.params.currency0.toString()],
        );
        return;
    }

    let token1 = getOrCreateToken(event.params.currency1);
    if (token1 === null) {
        log.warning(
            "Could not correctly resolve currency 1 at address {}, skipping pool indexing",
            [event.params.currency1.toString()],
        );
        return;
    }

    // load pool manager
    let poolManager = PoolManagerContract.load(POOL_MANAGER_ADDRESS)
    if (poolManager === null) {
        poolManager = new PoolManagerContract(POOL_MANAGER_ADDRESS)
        poolManager.poolCount = BI_0
        poolManager.totalVolumeETH = BD_0
        poolManager.totalVolumeUSD = BD_0
        poolManager.untrackedVolumeUSD = BD_0
        poolManager.totalFeesUSD = BD_0
        poolManager.totalFeesETH = BD_0
        poolManager.totalValueLockedUSD = BD_0
        poolManager.txCount = BI_0
        poolManager.owner = ZERO_ADDRESS
    }

    poolManager.poolCount = poolManager.poolCount.plus(BI_1)
    poolManager.save()

    // Create pool entity
    let pool = new Pool(event.params.id);
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.tick = event.params.tick;
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.fee = event.params.fee;
    pool.isDynamicFee = true;//isDynamicFee(event.params.fee); // CHANGE THIS UPON RESEARCH
    pool.hook = event.params.hooks;
    pool.liquidity = BI_0;
    pool.save();


}

export function handleSwap(event: SwapEvent): void {
    let pool = Pool.load(event.params.id);
    if (pool === null) {
        log.error("Pool not found for swap event: {}", [
            event.params.id.toHexString(),
        ]);
        return;
    }

    if (pool.sqrtPriceX96.notEqual(event.params.sqrtPriceX96)) {
        // Create swap change event
        let swapChange = new SwapChange(getEventId(event));
        swapChange.timestamp = event.block.timestamp;
        swapChange.blockNumber = event.block.number;
        swapChange.pool = pool.id;
        swapChange.tick = event.params.tick;
        swapChange.sqrtPriceX96 = event.params.sqrtPriceX96;
        swapChange.save();
    }

    // Update pool state
    pool.liquidity = event.params.liquidity;
    pool.tick = event.params.tick;
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    pool.save();
}

export function handleModifyLiquidity(event: ModifyLiquidityEvent): void {
    let pool = Pool.load(event.params.id);
    let poolManager = PoolManagerContract.load(POOL_MANAGER_ADDRESS)
    if (pool === null) {
        log.error("Pool not found for modify liquidity event: {}", [
            event.params.id.toHexString(),
        ]);
        return;
    }

    if (poolManager === null) {
        log.error("Pool Manager not found for address: {}", [
            POOL_MANAGER_ADDRESS.toHexString(),
        ]);
        return;
    }

    let token0 = getOrCreateToken(pool.token0);
    let token1 = getOrCreateToken(pool.token1);

    if (token0 && token1) {
        const currentTick:i32 = pool.tick!;
        const amount0Raw = getAmount0(event.params.tickLower, event.params.tickUpper, currentTick, event.params.liquidityDelta)
        const amount1Raw = getAmount1(event.params.tickLower, event.params.tickUpper, currentTick, event.params.liquidityDelta)
        // const amount0 = convertTokenToDecimal(amount0Raw, token0.decimals)
        // const amount1 = convertTokenToDecimal(amount1Raw, token1.decimals)

        // update globals
        poolManager.txCount = poolManager.txCount.plus(BI_1)

        // Pools liquidity tracks the currently active liquidity given pools current tick.
        // We only want to update it if the new position includes the current tick.
        if (
            pool.tick !== null &&
            (event.params.tickLower >= pool.tick ) &&
            (event.params.tickUpper > pool.tick)
          ) {
            pool.liquidity = pool.liquidity.plus(event.params.liquidityDelta)
        }

        pool.token0Tvl = pool.token0Tvl.plus(amount0Raw)
        pool.token1Tvl = pool.token1Tvl.plus(amount1Raw)

        pool.save()
        poolManager.save()
    }
    // Create or update position
    let positionId = getPositionId(
        pool.id,
        event.params.sender,
        event.params.tickLower,
        event.params.tickUpper,
        event.params.salt,
    );

    let position = Position.load(positionId);
    if (position === null) {
        position = new Position(positionId);
        position.owner = event.params.sender;
        position.lowerTick = event.params.tickLower;
        position.upperTick = event.params.tickUpper;
        position.liquidity = BI_0;
        position.direct = true; // All v4 positions are "direct" in this context
        position.pool = pool.id;
        position.salt = event.params.salt;
    }

    // Update position liquidity
    // Added liquidity
    position.liquidity = position.liquidity.plus(event.params.liquidityDelta);

    // Update tick data - following v3 pattern for minting
    let lowerTick = getOrCreateTick(pool.id, event.params.tickLower);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(event.params.liquidityDelta);
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(event.params.liquidityDelta);
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.tickUpper);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(event.params.liquidityDelta);
    upperTick.liquidityNet = upperTick.liquidityNet.minus(event.params.liquidityDelta);
    upperTick.save();



    // Save updated entities
    position.save();
    pool.save();

    // Create liquidity change event
    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.delta = event.params.liquidityDelta;
    liquidityChange.position = position.id;
    liquidityChange.save();
}

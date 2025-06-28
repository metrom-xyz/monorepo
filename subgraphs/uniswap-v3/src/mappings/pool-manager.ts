import { log } from "@graphprotocol/graph-ts";
import {
    Initialize as InitializeEvent,
    Swap as SwapEvent,
    ModifyLiquidity as ModifyLiquidityEvent,
    Donate as DonateEvent,
} from "../../generated/PoolManager/PoolManager";
import {
    Pool,
    SwapChange,
    LiquidityChange,
    Position,
} from "../../generated/schema";
import {
    BI_0,
    getEventId,
    getOrCreateToken,
    getOrCreateHook,
    getPrice,
    getPositionId,
    isDynamicFee,
    getOrCreateTick,
} from "../commons";
import { POOL_MANAGER_ADDRESS } from "../addresses";

export function handleInitialize(event: InitializeEvent): void {
    log.info("Handling pool initialization for pool id: {}", [
        event.params.id.toHexString(),
    ]);

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

    // Create hook if exists

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
    pool.isDynamicFee = isDynamicFee(event.params.fee);
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

    // Update pool state
    pool.liquidity = event.params.liquidity;
    pool.tick = event.params.tick;
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);

    // Update TVL (simplified - in v4, delta accounting makes this more complex)
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    pool.save();

    // Create swap change event
    let swapChange = new SwapChange(getEventId(event));
    swapChange.timestamp = event.block.timestamp;
    swapChange.blockNumber = event.block.number;
    swapChange.pool = pool.id;
    swapChange.tick = event.params.tick;
    swapChange.sqrtPriceX96 = event.params.sqrtPriceX96;
    swapChange.save();

    log.info("Swap processed for pool: {}, amounts: [{}, {}]", [
        pool.id.toHexString(),
        event.params.amount0.toString(),
        event.params.amount1.toString(),
    ]);
}

export function handleModifyLiquidity(event: ModifyLiquidityEvent): void {
    let pool = Pool.load(event.params.id);
    if (pool === null) {
        log.error("Pool not found for modify liquidity event: {}", [
            event.params.id.toHexString(),
        ]);
        return;
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
    if (event.params.liquidityDelta.gt(BI_0)) {
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

        // Update pool liquidity if current tick is within position range
        if (event.params.tickLower <= pool.tick && event.params.tickUpper > pool.tick) {
            pool.liquidity = pool.liquidity.plus(event.params.liquidityDelta);
        }

        // Note: TVL updates are handled in handleSwap since ModifyLiquidity doesn't emit token amounts

    } else if (event.params.liquidityDelta.lt(BI_0)) {
        // Removed liquidity
        let liquidityToRemove = event.params.liquidityDelta.neg(); // Convert to positive for calculations
        position.liquidity = position.liquidity.minus(liquidityToRemove);

        // Update tick data - following v3 pattern for burning
        let lowerTick = getOrCreateTick(pool.id, event.params.tickLower);
        lowerTick.liquidityGross = lowerTick.liquidityGross.minus(liquidityToRemove);
        lowerTick.liquidityNet = lowerTick.liquidityNet.minus(liquidityToRemove);
        lowerTick.save();

        let upperTick = getOrCreateTick(pool.id, event.params.tickUpper);
        upperTick.liquidityGross = upperTick.liquidityGross.minus(liquidityToRemove);
        upperTick.liquidityNet = upperTick.liquidityNet.plus(liquidityToRemove);
        upperTick.save();

        // Update pool liquidity if current tick is within position range
        if (event.params.tickLower <= pool.tick && event.params.tickUpper > pool.tick) {
            pool.liquidity = pool.liquidity.minus(liquidityToRemove);
        }

        // Note: TVL updates are handled in handleSwap since ModifyLiquidity doesn't emit token amounts
    }

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

    log.info(
        "Liquidity modified for pool: {}, position: {}, delta: {}, tick range: [{}, {}]",
        [
            pool.id.toHexString(),
            position.id.toHexString(),
            event.params.liquidityDelta.toString(),
            event.params.tickLower.toString(),
            event.params.tickUpper.toString(),
        ],
    );
}

// export function handleDynamicFeeUpdated(event: DynamicFeeUpdatedEvent): void {
//     let pool = Pool.load(event.params.id);
//     if (pool === null) {
//         log.error("Pool not found for dynamic fee update: {}", [
//             event.params.id.toHexString(),
//         ]);
//         return;
//     }

//     let oldFee = pool.fee;
//     let newFee = event.params.newDynamicLPFee;

//     // Update pool fee
//     pool.fee = newFee;
//     pool.save();

//     // Create fee change event
//     let feeChange = new FeeChange(getEventId(event));
//     feeChange.timestamp = event.block.timestamp;
//     feeChange.blockNumber = event.block.number;
//     feeChange.pool = pool.id;
//     feeChange.oldFee = oldFee;
//     feeChange.newFee = newFee;
//     feeChange.save();

//     log.info("Dynamic fee updated for pool: {}, old: {}, new: {}", [
//         pool.id.toHexString(),
//         oldFee.toString(),
//         newFee.toString(),
//     ]);
// }

export function handleDonate(event: DonateEvent): void {
    log.info("Handling donate event for pool: {}", [event.params.id.toHexString()]);
}
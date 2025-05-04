import { BigDecimal, BigInt, log, store } from "@graphprotocol/graph-ts";
import {
    PairCreated,
    StrategyCreated,
    StrategyDeleted,
    StrategyUpdated,
    TokensTraded,
    TradingFeePPMUpdated,
} from "../../generated/Controller/Controller";
import {
    Controller,
    Pool,
    Strategy,
    StrategyDelete,
    TickChange,
} from "../../generated/schema";
import { CONTROLLER_ADDRESS } from "../addresses";
import {
    BD_0,
    BI_0,
    createStrategyChange,
    getEventId,
    getOrCreateToken,
    getOrderId,
    getOrderOrThrow,
    getPoolId,
    getPoolOrThrow,
    getStrategyId,
    getStrategyOrThrow,
    updateOrCreateOrder,
    updateTicks,
} from "../commons";
import {
    calculateImpliedTick,
    decodeOrderToUniV3,
    EncodedOrder,
} from "../conversion";

export function handleTradingFeePPMUpdated(event: TradingFeePPMUpdated): void {
    let controller = Controller.load(CONTROLLER_ADDRESS);
    if (controller === null) controller = new Controller(CONTROLLER_ADDRESS);
    controller.fee = event.params.newFeePPM.toI32();
    controller.save();
}

export function handlePairCreated(event: PairCreated): void {
    const token0 = getOrCreateToken(event.params.token0);
    if (token0 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 0 at address {}, skipping pool indexing",
            [event.params.token0.toString()],
        );
        return;
    }

    const token1 = getOrCreateToken(event.params.token1);
    if (token1 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 1 at address {}, skipping pool indexing",
            [event.params.token1.toString()],
        );
        return;
    }

    const pool = new Pool(getPoolId(event.params.token0, event.params.token1));
    pool.onChainId = event.params.pairId;
    pool.token0 = token0.id;
    pool.token0Tvl = BI_0;
    pool.token1 = token1.id;
    pool.token1Tvl = BI_0;
    pool.tick = 0;
    pool.price = BD_0;
    pool.liquidity = BI_0;
    pool.controller = CONTROLLER_ADDRESS;
    pool.save();
}

export function handleStrategyCreated(event: StrategyCreated): void {
    const ordersInverted =
        event.params.token0.toHex() > event.params.token1.toHex();

    const order0 = ordersInverted
        ? decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order1.y,
                  event.params.order1.z,
                  event.params.order1.A,
                  event.params.order1.B,
              ),
              true,
          )
        : decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order0.y,
                  event.params.order0.z,
                  event.params.order0.A,
                  event.params.order0.B,
              ),
              true,
          );
    const order1 = ordersInverted
        ? decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order0.y,
                  event.params.order0.z,
                  event.params.order0.A,
                  event.params.order0.B,
              ),
              false,
          )
        : decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order1.y,
                  event.params.order1.z,
                  event.params.order1.A,
                  event.params.order1.B,
              ),
              false,
          );

    const pool = getPoolOrThrow(event.params.token0, event.params.token1);

    if (order0.active) {
        pool.token0Tvl = pool.token0Tvl.plus(order0.tokenTvl);
        pool.liquidity = pool.liquidity.plus(order0.liquidity);
        updateTicks(
            pool.id,
            order0.lowerTick,
            order0.upperTick,
            order0.liquidity,
        );
    }
    if (order1.active) {
        pool.token1Tvl = pool.token1Tvl.plus(order1.tokenTvl);
        pool.liquidity = pool.liquidity.plus(order1.liquidity);
        updateTicks(
            pool.id,
            order1.lowerTick,
            order1.upperTick,
            order1.liquidity,
        );
    }

    pool.save();

    const strategy = new Strategy(getStrategyId(event.params.id));
    strategy.owner = event.params.owner;
    strategy.order0 = updateOrCreateOrder(
        getOrderId(strategy.id, true),
        pool.id,
        order0,
    ).id;
    strategy.order1 = updateOrCreateOrder(
        getOrderId(strategy.id, false),
        pool.id,
        order1,
    ).id;
    strategy.pool = pool.id;
    strategy.active = order0.active || order1.active;
    strategy.save();

    createStrategyChange(event, strategy, order0, order1);
}

export function handleStrategyDeleted(event: StrategyDeleted): void {
    const pool = getPoolOrThrow(event.params.token0, event.params.token1);
    let strategy = getStrategyOrThrow(event.params.id);

    let order0 = getOrderOrThrow(strategy.order0);
    if (order0.active) {
        let liquidityDelta = order0.liquidity.neg();
        pool.token0Tvl = pool.token0Tvl.minus(order0.tokenTvl);
        pool.liquidity = pool.liquidity.plus(liquidityDelta);
        updateTicks(
            pool.id,
            order0.lowerTick,
            order0.upperTick,
            liquidityDelta,
        );
    }

    let order1 = getOrderOrThrow(strategy.order1);
    if (order1.active) {
        let liquidityDelta = order1.liquidity.neg();
        pool.token1Tvl = pool.token1Tvl.minus(order1.tokenTvl);
        pool.liquidity = pool.liquidity.plus(liquidityDelta);
        updateTicks(
            pool.id,
            order1.lowerTick,
            order1.upperTick,
            liquidityDelta,
        );
    }

    pool.save();

    const strategyDelete = new StrategyDelete(getEventId(event));
    strategyDelete.timestamp = event.block.timestamp;
    strategyDelete.strategyId = getStrategyId(event.params.id);
    strategyDelete.pool = pool.id;
    strategyDelete.save();

    store.remove("Strategy", getStrategyId(event.params.id).toHex());
}

export function handleStrategyUpdated(event: StrategyUpdated): void {
    const pool = getPoolOrThrow(event.params.token0, event.params.token1);
    const strategy = getStrategyOrThrow(event.params.id);

    const ordersInverted =
        event.params.token0.toHex() > event.params.token1.toHex();

    const order0 = ordersInverted
        ? decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order1.y,
                  event.params.order1.z,
                  event.params.order1.A,
                  event.params.order1.B,
              ),
              true,
          )
        : decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order0.y,
                  event.params.order0.z,
                  event.params.order0.A,
                  event.params.order0.B,
              ),
              true,
          );
    const order1 = ordersInverted
        ? decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order0.y,
                  event.params.order0.z,
                  event.params.order0.A,
                  event.params.order0.B,
              ),
              false,
          )
        : decodeOrderToUniV3(
              new EncodedOrder(
                  event.params.order1.y,
                  event.params.order1.z,
                  event.params.order1.A,
                  event.params.order1.B,
              ),
              false,
          );

    let poolToken0Delta = BI_0;
    let poolToken1Delta = BI_0;

    let poolLiquidity0Delta = BI_0;
    let poolLiquidity1Delta = BI_0;

    // in the following if we leave out the "both old and new orders are inactive" as there's
    // no actual change to the pool's state in that case, just at the strategy level
    let strategyOrder0 = getOrderOrThrow(strategy.order0);
    if (strategyOrder0.active && !order0.active) {
        // old order active and new one inactive
        poolToken0Delta = strategyOrder0.tokenTvl.neg();
        poolLiquidity0Delta = strategyOrder0.liquidity.neg();
    } else if (!strategyOrder0.active && order0.active) {
        // old order inactive and new one active
        poolToken0Delta = order0.tokenTvl;
        poolLiquidity0Delta = order0.liquidity;
    } else if (strategyOrder0.active && order0.active) {
        // old order active and new one also active
        poolToken0Delta = order0.tokenTvl.minus(strategyOrder0.tokenTvl);
        poolLiquidity0Delta = order0.liquidity.minus(strategyOrder0.liquidity);
    }

    strategy.order0 = updateOrCreateOrder(
        getOrderId(strategy.id, true),
        strategy.pool,
        order0,
    ).id;

    updateTicks(
        pool.id,
        order0.lowerTick,
        order0.upperTick,
        poolLiquidity0Delta,
    );

    // in the following if we leave out the "both old and new orders are inactive" as there's
    // no actual change to the pool's state in that case, just at the strategy level
    let strategyOrder1 = getOrderOrThrow(strategy.order1);
    if (strategyOrder1.active && !order1.active) {
        // old order active and new one inactive
        poolToken1Delta = strategyOrder1.tokenTvl.neg();
        poolLiquidity1Delta = strategyOrder1.liquidity.neg();
    } else if (!strategyOrder1.active && order1.active) {
        // old order inactive and new one active
        poolToken1Delta = order1.tokenTvl;
        poolLiquidity1Delta = order1.liquidity;
    } else if (strategyOrder1.active && order1.active) {
        // old order active and new one also active
        poolToken1Delta = order1.tokenTvl.minus(strategyOrder1.tokenTvl);
        poolLiquidity1Delta = order1.liquidity.minus(strategyOrder1.liquidity);
    }

    strategy.order1 = updateOrCreateOrder(
        getOrderId(strategy.id, false),
        strategy.pool,
        order1,
    ).id;

    updateTicks(
        pool.id,
        order1.lowerTick,
        order1.upperTick,
        poolLiquidity1Delta,
    );

    strategy.active = order0.active || order1.active;
    strategy.save();

    pool.token0Tvl = pool.token0Tvl.plus(poolToken0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(poolToken1Delta);
    pool.liquidity = pool.liquidity
        .plus(poolLiquidity0Delta)
        .plus(poolLiquidity1Delta);
    pool.save();

    createStrategyChange(event, strategy, order0, order1);
}

export function handleTokensTraded(event: TokensTraded): void {
    // Notice how in this handler we don't update TVLs. That's because
    // each swap also emits a related StrategyUpdated event for touched
    // positions, and we use that to update the pool's token TVLs in the
    // handleStrategyUpdates handler

    let token0To1 = true;
    let token0 = event.params.sourceToken;
    let token1 = event.params.targetToken;
    if (event.params.targetToken.toHex() < event.params.sourceToken.toHex()) {
        token0To1 = false;
        token0 = event.params.targetToken;
        token1 = event.params.sourceToken;
    }

    let token0Delta: BigInt;
    let token1Delta: BigInt;
    if (token0To1) {
        token0Delta = event.params.sourceAmount;
        token1Delta = event.params.targetAmount.neg();
    } else {
        token0Delta = event.params.targetAmount.neg();
        token1Delta = event.params.sourceAmount;
    }

    const pool = getPoolOrThrow(token0, token1);

    if (!token0Delta.isZero())
        pool.price = BigDecimal.fromString(token1Delta.abs().toString()).div(
            BigDecimal.fromString(token0Delta.abs().toString()),
        );

    const newTick = calculateImpliedTick(pool.price);
    if (pool.tick !== newTick) {
        const tickChange = new TickChange(getEventId(event));
        tickChange.timestamp = event.block.timestamp;
        tickChange.pool = pool.id;
        tickChange.newTick = newTick;
        tickChange.save();
    }

    pool.tick = newTick;
    pool.save();
}

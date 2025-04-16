import { BigDecimal, Bytes, log } from "@graphprotocol/graph-ts";
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
    Order,
    Pool,
    Strategy,
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
    const order0 = decodeOrderToUniV3(
        new EncodedOrder(
            event.params.order0.y,
            event.params.order0.z,
            event.params.order0.A,
            event.params.order0.B,
        ),
        true,
    );
    const order1 = decodeOrderToUniV3(
        new EncodedOrder(
            event.params.order1.y,
            event.params.order1.z,
            event.params.order1.A,
            event.params.order1.B,
        ),
        false,
    );

    const pool = getPoolOrThrow(event.params.token0, event.params.token1);
    if (order0 !== null) {
        pool.token0Tvl = pool.token0Tvl.plus(order0.tokenTvl);
        pool.liquidity = pool.liquidity.plus(order0.liquidity);
        updateTicks(pool.id, order0, false);
    }
    if (order1 !== null) {
        pool.token1Tvl = pool.token1Tvl.plus(order1.tokenTvl);
        pool.liquidity = pool.liquidity.plus(order1.liquidity);
        updateTicks(pool.id, order1, false);
    }
    pool.save();

    const strategy = new Strategy(
        Bytes.fromByteArray(Bytes.fromBigInt(event.params.id)),
    );
    strategy.owner = event.params.owner;

    if (order0 !== null) {
        strategy.order0 = updateOrCreateOrder(
            getOrderId(strategy.id, true),
            pool.id,
            order0,
        ).id;
    }

    if (order1 !== null) {
        strategy.order1 = updateOrCreateOrder(
            getOrderId(strategy.id, false),
            pool.id,
            order1,
        ).id;
    }

    strategy.pool = pool.id;
    strategy.save();

    createStrategyChange(event, strategy, order0, order1);
}

export function handleStrategyDeleted(event: StrategyDeleted): void {
    const order0 = decodeOrderToUniV3(
        new EncodedOrder(
            event.params.order0.y,
            event.params.order0.z,
            event.params.order0.A,
            event.params.order0.B,
        ),
        true,
    );
    const order1 = decodeOrderToUniV3(
        new EncodedOrder(
            event.params.order1.y,
            event.params.order1.z,
            event.params.order1.A,
            event.params.order1.B,
        ),
        false,
    );

    const pool = getPoolOrThrow(event.params.token0, event.params.token1);
    if (order0 !== null) {
        pool.token0Tvl = pool.token0Tvl.minus(order0.tokenTvl);
        pool.liquidity = pool.liquidity.minus(order0.liquidity);
        updateTicks(pool.id, order0, true);
    }
    if (order1 !== null) {
        pool.token1Tvl = pool.token1Tvl.minus(order1.tokenTvl);
        pool.liquidity = pool.liquidity.minus(order1.liquidity);
        updateTicks(pool.id, order1, true);
    }
    pool.save();

    const strategy = getStrategyOrThrow(event.params.id);
    strategy.order0 = null;
    strategy.order1 = null;
    strategy.save();

    createStrategyChange(event, strategy, order0, order1);
}

export function handleStrategyUpdated(event: StrategyUpdated): void {
    const pool = getPoolOrThrow(event.params.token0, event.params.token1);

    const strategy = getStrategyOrThrow(event.params.id);

    const order0 = decodeOrderToUniV3(
        new EncodedOrder(
            event.params.order0.y,
            event.params.order0.z,
            event.params.order0.A,
            event.params.order0.B,
        ),
        true,
    );
    const order1 = decodeOrderToUniV3(
        new EncodedOrder(
            event.params.order1.y,
            event.params.order1.z,
            event.params.order1.A,
            event.params.order1.B,
        ),
        false,
    );

    let token0Delta = BI_0;
    let token1Delta = BI_0;

    let liquidity0Delta = BI_0;
    let liquidity1Delta = BI_0;

    if (order0 !== null) {
        let strategyOrder0: Order | null = null;
        if (strategy.order0 !== null)
            strategyOrder0 = getOrderOrThrow(strategy.order0!);

        token0Delta =
            strategyOrder0 === null
                ? order0.tokenTvl
                : strategyOrder0.tokenTvl.minus(order0.tokenTvl);
        liquidity0Delta =
            strategyOrder0 === null
                ? order0.liquidity
                : strategyOrder0.tokenTvl.minus(order0.liquidity);

        strategy.order0 = updateOrCreateOrder(
            getOrderId(strategy.id, true),
            strategy.pool,
            order0,
        ).id;

        updateTicks(pool.id, order0, liquidity0Delta.lt(BI_0));
    }
    if (order1 !== null) {
        let strategyOrder1: Order | null = null;
        if (strategy.order1 !== null)
            strategyOrder1 = getOrderOrThrow(strategy.order1!);

        token1Delta =
            strategyOrder1 === null
                ? order1.tokenTvl
                : strategyOrder1.tokenTvl.minus(order1.tokenTvl);
        liquidity1Delta =
            strategyOrder1 === null
                ? order1.liquidity
                : strategyOrder1.tokenTvl.minus(order1.liquidity);

        strategy.order1 = updateOrCreateOrder(
            getOrderId(strategy.id, false),
            strategy.pool,
            order1,
        ).id;

        updateTicks(pool.id, order1, liquidity1Delta.lt(BI_0));
    }

    strategy.save();

    pool.token0Tvl = pool.token0Tvl.plus(token0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(token1Delta);
    pool.liquidity = pool.liquidity.plus(liquidity0Delta).plus(liquidity1Delta);
    pool.save();

    createStrategyChange(event, strategy, order0, order1);
}

export function handleTokensTraded(event: TokensTraded): void {
    const token0To1 =
        event.params.sourceToken.toHex() < event.params.targetToken.toHex();

    const token0 = token0To1
        ? event.params.sourceToken
        : event.params.targetToken;
    const token1 = token0To1
        ? event.params.targetToken
        : event.params.sourceToken;

    const token0Delta = token0To1
        ? event.params.sourceAmount
        : event.params.targetAmount.neg();
    const token1Delta = token0To1
        ? event.params.targetAmount.neg()
        : event.params.sourceAmount;

    const pool = getPoolOrThrow(token0, token1);
    pool.token0Tvl = pool.token0Tvl.plus(token0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(token1Delta);

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

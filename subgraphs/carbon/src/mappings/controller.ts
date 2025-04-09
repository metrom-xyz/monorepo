import { Address, BigDecimal, log } from "@graphprotocol/graph-ts";
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
    StrategyChange,
    Pool,
    TickChange,
} from "../../generated/schema";
import {
    BD_0,
    BI_0,
    getEventId,
    getOrCreateToken,
    getPoolId,
    getPoolOrThrow,
    getTickFromEncodedRate,
    getTickFromPrice,
    getTokenOrThrow,
    scaleToDecimals,
    updateTicks,
    getOrCreateStrategy,
    getStrategyOrThrow,
} from "../commons";
import { CONTROLLER_ADDRESS } from "../addresses";

export function handleTradingFeePPMUpdated(event: TradingFeePPMUpdated): void {
    let controller = Controller.load(CONTROLLER_ADDRESS);
    if (controller === null) controller = new Controller(CONTROLLER_ADDRESS);
    controller.fee = event.params.newFeePPM.toI32();
    controller.save();
}

export function handlePairCreated(event: PairCreated): void {
    let token0 = getOrCreateToken(event.params.token0);
    if (token0 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 0 at address {}, skipping pool indexing",
            [event.params.token0.toString()],
        );
        return;
    }

    let token1 = getOrCreateToken(event.params.token1);
    if (token1 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 1 at address {}, skipping pool indexing",
            [event.params.token1.toString()],
        );
        return;
    }

    let pool = new Pool(getPoolId(event.params.token0, event.params.token1));
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
    if (event.params.order0.y.isZero() && event.params.order1.y.isZero())
        return;

    let pool = getPoolOrThrow(event.params.token0, event.params.token1);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.order0.y);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.order1.y);
    pool.liquidity = pool.liquidity
        .plus(
            scaleToDecimals(
                getTokenOrThrow(changetype<Address>(pool.token0)).decimals,
                18,
                event.params.order0.y,
            ),
        )
        .plus(
            scaleToDecimals(
                getTokenOrThrow(changetype<Address>(pool.token1)).decimals,
                18,
                event.params.order1.y,
            ),
        );
    pool.save();

    updateTicks(
        pool.id,
        event.params.order0.A,
        event.params.order0.B,
        event.params.order0.y,
    );

    updateTicks(
        pool.id,
        event.params.order1.A,
        event.params.order1.B,
        event.params.order1.y,
    );

    let strategy = getOrCreateStrategy(
        event.params.id,
        pool,
        event.params.owner,
        event.params.order0.A,
        event.params.order0.B,
        event.params.order0.y,
        event.params.order1.A,
        event.params.order1.B,
        event.params.order1.y,
    );

    let strategyChange = new StrategyChange(getEventId(event));
    strategyChange.timestamp = event.block.timestamp;
    strategyChange.strategyId = strategy.id;
    strategyChange.owner = strategy.owner;
    strategyChange.lowerTick0 = strategy.lowerTick0;
    strategyChange.upperTick0 = strategy.upperTick0;
    strategyChange.liquidity0 = strategy.liquidity0;
    strategyChange.lowerTick1 = strategy.lowerTick1;
    strategyChange.upperTick1 = strategy.upperTick1;
    strategyChange.liquidity1 = strategy.liquidity1;
    strategyChange.pool = pool.id;
    strategyChange.save();
}

export function handleStrategyDeleted(event: StrategyDeleted): void {
    let pool = getPoolOrThrow(event.params.token0, event.params.token1);
    pool.token0Tvl = pool.token0Tvl.minus(event.params.order0.y);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.order1.y);
    pool.liquidity = pool.liquidity
        .minus(
            scaleToDecimals(
                getTokenOrThrow(changetype<Address>(pool.token0)).decimals,
                18,
                event.params.order0.y,
            ),
        )
        .minus(
            scaleToDecimals(
                getTokenOrThrow(changetype<Address>(pool.token1)).decimals,
                18,
                event.params.order1.y,
            ),
        );
    pool.save();

    updateTicks(
        pool.id,
        event.params.order0.A,
        event.params.order0.B,
        event.params.order0.y.neg(),
    );

    updateTicks(
        pool.id,
        event.params.order1.A,
        event.params.order1.B,
        event.params.order1.y.neg(),
    );

    let strategy = getStrategyOrThrow(event.params.id);
    strategy.liquidity0 = BI_0;
    strategy.liquidity1 = BI_0;
    strategy.save();

    let strategyChange = new StrategyChange(getEventId(event));
    strategyChange.timestamp = event.block.timestamp;
    strategyChange.strategyId = strategy.id;
    strategyChange.owner = strategy.owner;
    strategyChange.lowerTick0 = strategy.lowerTick0;
    strategyChange.upperTick0 = strategy.upperTick0;
    strategyChange.liquidity0 = strategy.liquidity0;
    strategyChange.lowerTick1 = strategy.lowerTick1;
    strategyChange.upperTick1 = strategy.upperTick1;
    strategyChange.liquidity1 = strategy.liquidity1;
    strategyChange.pool = pool.id;
    strategyChange.save();
}

export function handleStrategyUpdated(event: StrategyUpdated): void {
    let pool = getPoolOrThrow(event.params.token0, event.params.token1);

    let token0 = getTokenOrThrow(changetype<Address>(pool.token0));
    let token1 = getTokenOrThrow(changetype<Address>(pool.token1));

    let strategy = getStrategyOrThrow(event.params.id);

    let token0Delta = scaleToDecimals(
        18,
        token0.decimals,
        strategy.liquidity0,
    ).minus(event.params.order0.y);
    let token1Delta = scaleToDecimals(
        18,
        token1.decimals,
        strategy.liquidity1,
    ).minus(event.params.order1.y);

    strategy.lowerTick0 = getTickFromEncodedRate(event.params.order0.B);
    strategy.upperTick0 = getTickFromEncodedRate(
        event.params.order0.B.plus(event.params.order0.A),
    );
    strategy.liquidity0 = event.params.order0.y;
    strategy.lowerTick1 = getTickFromEncodedRate(event.params.order1.B);
    strategy.upperTick1 = getTickFromEncodedRate(
        event.params.order1.B.plus(event.params.order1.A),
    );
    strategy.liquidity1 = event.params.order1.y;
    strategy.save();

    pool.token0Tvl = pool.token0Tvl.plus(token0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(token1Delta);
    pool.liquidity = pool.liquidity
        .plus(
            scaleToDecimals(
                getTokenOrThrow(changetype<Address>(pool.token0)).decimals,
                18,
                token0Delta,
            ),
        )
        .plus(
            scaleToDecimals(
                getTokenOrThrow(changetype<Address>(pool.token1)).decimals,
                18,
                token1Delta,
            ),
        );
    pool.save();

    updateTicks(
        pool.id,
        event.params.order0.A,
        event.params.order0.B,
        token0Delta,
    );

    updateTicks(
        pool.id,
        event.params.order1.A,
        event.params.order1.B,
        token1Delta,
    );

    let strategyChange = new StrategyChange(getEventId(event));
    strategyChange.timestamp = event.block.timestamp;
    strategyChange.strategyId = strategy.id;
    strategyChange.owner = strategy.owner;
    strategyChange.lowerTick0 = strategy.lowerTick0;
    strategyChange.upperTick0 = strategy.upperTick0;
    strategyChange.liquidity0 = strategy.liquidity0;
    strategyChange.lowerTick1 = strategy.lowerTick1;
    strategyChange.upperTick1 = strategy.upperTick1;
    strategyChange.liquidity1 = strategy.liquidity1;
    strategyChange.pool = pool.id;
    strategyChange.save();
}

export function handleTokensTraded(event: TokensTraded): void {
    let token0To1 =
        event.params.sourceToken.toHex() < event.params.targetToken.toHex();

    let token0 = token0To1
        ? event.params.sourceToken
        : event.params.targetToken;
    let token1 = token0To1
        ? event.params.targetToken
        : event.params.sourceToken;

    let token0Delta = token0To1
        ? event.params.sourceAmount
        : event.params.targetAmount.neg();
    let token1Delta = token0To1
        ? event.params.targetAmount.neg()
        : event.params.sourceAmount;

    let pool = getPoolOrThrow(token0, token1);
    pool.token0Tvl = pool.token0Tvl.plus(token0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(token1Delta);

    if (!token0Delta.isZero())
        pool.price = BigDecimal.fromString(token1Delta.abs().toString()).div(
            BigDecimal.fromString(token0Delta.abs().toString()),
        );

    let newTick = getTickFromPrice(pool.price);
    if (pool.tick !== newTick) {
        let tickChange = new TickChange(getEventId(event));
        tickChange.timestamp = event.block.timestamp;
        tickChange.pool = pool.id;
        tickChange.newTick = newTick;
        tickChange.save();
    }

    pool.tick = newTick;
    pool.save();
}

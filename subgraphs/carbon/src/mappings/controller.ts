import { BigDecimal, log } from "@graphprotocol/graph-ts";
import {
    PairCreated,
    StrategyCreated,
    StrategyDeleted,
    StrategyUpdated,
    TokensTraded,
    TradingFeePPMUpdated,
} from "../../generated/Controller/Controller";
import { Fee, LiquidityChange, Pool, TickChange } from "../../generated/schema";
import {
    BD_0,
    BI_0,
    FEE_ID,
    getEventId,
    getOrCreatePosition,
    getOrCreateToken,
    getOrderOrThrow,
    getPoolId,
    getPoolOrThrow,
    getPositionOrThrow,
    getTickFromEncodedRate,
    getTickFromPrice,
    updateTicks,
} from "../commons";

export function handleTradingFeePPMUpdated(event: TradingFeePPMUpdated): void {
    let fee = Fee.load(FEE_ID);
    if (fee === null) fee = new Fee(FEE_ID);
    fee.value = event.params.newFeePPM.toI32();
    fee.save();
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
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.tick = 0;
    pool.price = BD_0;
    pool.liquidity = BI_0;
    pool.fee = FEE_ID;
    pool.save();
}

export function handleStrategyCreated(event: StrategyCreated): void {
    let pool = getPoolOrThrow(event.params.token0, event.params.token1);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.order0.y);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.order1.y);
    pool.save();

    let order0LowerTickIdx = getTickFromEncodedRate(event.params.order0.B);
    let order0UpperTickIdx = getTickFromEncodedRate(
        event.params.order0.B.plus(event.params.order0.A),
    );

    let order1LowerTickIdx = getTickFromEncodedRate(event.params.order1.B);
    let order1UpperTickIdx = getTickFromEncodedRate(
        event.params.order1.B.plus(event.params.order1.A),
    );

    updateTicks(
        pool.id,
        order0LowerTickIdx,
        order0UpperTickIdx,
        event.params.order0.y,
    );

    updateTicks(
        pool.id,
        order1LowerTickIdx,
        order1UpperTickIdx,
        event.params.order1.y,
    );

    getOrCreatePosition(
        event.params.id,
        pool.id,
        event.params.owner,
        order0LowerTickIdx,
        order0UpperTickIdx,
        event.params.order0.y,
        order1LowerTickIdx,
        order1UpperTickIdx,
        event.params.order1.y,
    );
}

export function handleStrategyDeleted(event: StrategyDeleted): void {
    let pool = getPoolOrThrow(event.params.token0, event.params.token1);
    pool.token0Tvl = pool.token0Tvl.minus(event.params.order0.y);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.order1.y);
    pool.save();

    let position = getPositionOrThrow(event.params.id);

    let order0 = getOrderOrThrow(position.order0);
    order0.liquidity = BI_0;
    order0.save();

    let order1 = getOrderOrThrow(position.order1);
    order1.liquidity = BI_0;
    order1.save();

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.delta0 = event.params.order0.y;
    liquidityChange.delta1 = event.params.order1.y;
    liquidityChange.position = position.id;
    liquidityChange.save();
}

export function handleStrategyUpdated(event: StrategyUpdated): void {
    if (event.params.reason !== 0) return; // trades are handled in the tokens traded handler

    let position = getPositionOrThrow(event.params.id);

    let order0 = getOrderOrThrow(position.order0);
    let token0Delta = event.params.order0.y.minus(order0.liquidity);
    order0.liquidity = event.params.order0.y;
    order0.save();

    let order1 = getOrderOrThrow(position.order1);
    let token1Delta = event.params.order1.y.minus(order1.liquidity);
    order1.liquidity = event.params.order1.y;
    order1.save();

    let pool = getPoolOrThrow(event.params.token0, event.params.token1);
    pool.token0Tvl = pool.token0Tvl.plus(token0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(token1Delta);
    pool.save();

    updateTicks(
        pool.id,
        getTickFromEncodedRate(event.params.order0.B),
        getTickFromEncodedRate(
            event.params.order0.B.plus(event.params.order0.A),
        ),
        event.params.order0.y.neg(),
    );

    updateTicks(
        pool.id,
        getTickFromEncodedRate(event.params.order1.B),
        getTickFromEncodedRate(
            event.params.order1.B.plus(event.params.order1.A),
        ),
        event.params.order1.y.neg(),
    );

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.delta0 = token0Delta;
    liquidityChange.delta1 = token1Delta;
    liquidityChange.position = position.id;
    liquidityChange.save();
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
        tickChange.blockNumber = event.block.number;
        tickChange.pool = pool.id;
        tickChange.newTick = newTick;
        tickChange.save();
    }

    pool.tick = newTick;
    pool.save();
}

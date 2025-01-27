import {
    TokenExchange as TokenExchangeEvent,
    AddLiquidity as AddLiquidityEvent,
    RemoveLiquidity as RemoveLiquidityEvent,
    RemoveLiquidityOne as RemoveLiquidityOneEvent,
    RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
} from "../../generated/templates/Pool2/Pool2";
import {
    getEventId,
    getOrCreatePosition,
    getPoolOrThrow,
    getPositionOrThrow,
} from "../commons";
import { LiquidityChange } from "../../generated/schema";

export function handleTokenExchange(event: TokenExchangeEvent): void {
    let boughtId = event.params.bought_id.toI32();
    let soldId = event.params.sold_id.toI32();

    let pool = getPoolOrThrow(event.address);

    if (boughtId === 0)
        pool.token0Tvl = pool.token0Tvl.minus(event.params.tokens_bought);
    else if (boughtId === 1)
        pool.token1Tvl = pool.token1Tvl.minus(event.params.tokens_bought);
    else throw new Error("Bought id greater than 1 for 2-token pool");

    if (soldId === 0)
        pool.token0Tvl = pool.token0Tvl.plus(event.params.tokens_sold);
    else if (soldId === 1)
        pool.token1Tvl = pool.token1Tvl.plus(event.params.tokens_sold);
    else throw new Error("Sold id greater than 1 for 2-token pool");

    pool.save();
}

export function handleAddLiquidity(event: AddLiquidityEvent): void {
    let pool = getPoolOrThrow(event.address);
    let addedLiquidity = event.params.token_supply.minus(pool.liquidity);
    if (addedLiquidity.isZero()) {
        return;
    }

    pool.token0Tvl = pool.token0Tvl.plus(event.params.token_amounts[0]);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.token_amounts[1]);
    pool.liquidity = event.params.token_supply;
    pool.save();

    let position = getOrCreatePosition(event.address, event.params.provider);
    position.liquidity = position.liquidity.plus(addedLiquidity);
    position.save();

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.transactionHash = event.transaction.hash;
    liquidityChange.delta = addedLiquidity;
    liquidityChange.position = position.id;
    liquidityChange.save();
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
    let pool = getPoolOrThrow(event.address);
    let removedLiquidity = pool.liquidity.minus(event.params.token_supply);
    if (removedLiquidity.isZero()) {
        return;
    }

    pool.liquidity = event.params.token_supply;
    pool.token0Tvl = pool.token0Tvl.minus(event.params.token_amounts[0]);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.token_amounts[1]);
    pool.save();

    let position = getPositionOrThrow(event.address, event.params.provider);
    position.liquidity = position.liquidity.minus(removedLiquidity);
    position.save();

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.transactionHash = event.transaction.hash;
    liquidityChange.delta = removedLiquidity.neg();
    liquidityChange.position = position.id;
    liquidityChange.save();
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOneEvent): void {
    if (event.params.token_amount.isZero()) {
        return;
    }

    let pool = getPoolOrThrow(event.address);
    pool.liquidity = pool.liquidity.minus(event.params.token_amount);
    pool.save();

    let index = event.params.index.toI32();
    if (index === 0)
        pool.token0Tvl = pool.token0Tvl.minus(event.params.coin_amount);
    else if (index === 1)
        pool.token1Tvl = pool.token1Tvl.minus(event.params.coin_amount);
    else throw new Error("Index greater than 1 for 2-token pool");

    let position = getPositionOrThrow(event.address, event.params.provider);
    position.liquidity = position.liquidity.minus(event.params.token_amount);
    position.save();

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.transactionHash = event.transaction.hash;
    liquidityChange.delta = event.params.token_amount.neg();
    liquidityChange.position = position.id;
    liquidityChange.save();
}

export function handleRemoveLiquidityImbalance(
    event: RemoveLiquidityImbalanceEvent,
): void {
    let pool = getPoolOrThrow(event.address);
    let removedLiquidity = pool.liquidity.minus(event.params.token_supply);
    if (removedLiquidity.isZero()) {
        return;
    }

    pool.liquidity = event.params.token_supply;
    pool.token0Tvl = pool.token0Tvl.minus(event.params.token_amounts[0]);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.token_amounts[1]);
    pool.save();

    let position = getPositionOrThrow(event.address, event.params.provider);
    position.liquidity = position.liquidity.minus(removedLiquidity);
    position.save();

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.transactionHash = event.transaction.hash;
    liquidityChange.delta = removedLiquidity.neg();
    liquidityChange.position = position.id;
    liquidityChange.save();
}

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
    getSortedPoolTokens,
} from "../commons";
import { LiquidityChange } from "../../generated/schema";

export function handleTokenExchange(event: TokenExchangeEvent): void {
    let boughtId = event.params.bought_id.toI32();
    let soldId = event.params.sold_id.toI32();

    let pool = getPoolOrThrow(event.address);
    let poolTokens = getSortedPoolTokens(pool);
    poolTokens[boughtId].tvl = poolTokens[boughtId].tvl.minus(
        event.params.tokens_bought,
    );
    poolTokens[boughtId].save();

    poolTokens[soldId].tvl = poolTokens[soldId].tvl.plus(
        event.params.tokens_sold,
    );
    poolTokens[soldId].save();

    pool.save();
}

export function handleAddLiquidity(event: AddLiquidityEvent): void {
    let pool = getPoolOrThrow(event.address);
    let addedLiquidity = event.params.token_supply.minus(pool.liquidity);
    if (addedLiquidity.isZero()) {
        return;
    }

    pool.liquidity = event.params.token_supply;
    pool.save();

    let poolTokens = getSortedPoolTokens(pool);

    poolTokens[0].tvl = poolTokens[0].tvl.plus(event.params.token_amounts[0]);
    poolTokens[0].save();

    poolTokens[1].tvl = poolTokens[1].tvl.plus(event.params.token_amounts[1]);
    poolTokens[1].save();

    poolTokens[2].tvl = poolTokens[2].tvl.plus(event.params.token_amounts[2]);
    poolTokens[2].save();

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
    pool.save();

    let poolTokens = getSortedPoolTokens(pool);

    poolTokens[0].tvl = poolTokens[0].tvl.minus(event.params.token_amounts[0]);
    poolTokens[0].save();

    poolTokens[1].tvl = poolTokens[1].tvl.minus(event.params.token_amounts[1]);
    poolTokens[1].save();

    poolTokens[2].tvl = poolTokens[2].tvl.minus(event.params.token_amounts[2]);
    poolTokens[2].save();

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

    let poolTokens = getSortedPoolTokens(pool);

    let index = event.params.index.toI32();
    poolTokens[index].tvl = poolTokens[index].tvl.minus(
        event.params.coin_amount,
    );
    poolTokens[index].save();

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
    pool.save();

    let poolTokens = getSortedPoolTokens(pool);

    poolTokens[0].tvl = poolTokens[0].tvl.minus(event.params.token_amounts[0]);
    poolTokens[0].save();

    poolTokens[1].tvl = poolTokens[1].tvl.minus(event.params.token_amounts[1]);
    poolTokens[1].save();

    poolTokens[2].tvl = poolTokens[2].tvl.minus(event.params.token_amounts[2]);
    poolTokens[2].save();

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

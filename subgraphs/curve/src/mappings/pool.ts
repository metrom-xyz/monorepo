import {
    AddLiquidity,
    TokenExchange,
    RemoveLiquidity,
    RemoveLiquidityOne,
    TokenExchangeUnderlying,
    RemoveLiquidityImbalance,
} from "../../generated/templates/Pool/Pool";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
    getEventId,
    getOrCreatePosition,
    getOrCreatePool,
    getPoolOrThrow,
    updateTokenTvls,
} from "../commons";
import { LiquidityChange, Swap } from "../../generated/schema";

function handleSwap(
    event: ethereum.Event,
    boughtId: i32,
    boughtAmount: BigInt,
    soldId: i32,
    soldAmount: BigInt,
    underlying: bool,
): void {
    let pool = getOrCreatePool(event.block.number, event.address);

    let tokenIn: Bytes;
    let tokenOut: Bytes;

    if (underlying && pool.base !== null) {
        let basePool = getPoolOrThrow(changetype<Address>(pool.base));

        tokenIn = soldId === 0 ? pool.tokens[0] : basePool.tokens[soldId - 1];
        tokenOut =
            boughtId === 0 ? pool.tokens[0] : basePool.tokens[boughtId - 1];
    } else {
        tokenIn = pool.tokens[soldId];
        tokenOut = pool.tokens[boughtId];
    }

    updateTokenTvls(event.block.number, pool);
    pool.save();

    let swap = new Swap(getEventId(event));
    swap.timestamp = event.block.timestamp;
    swap.blockNumber = event.block.number;
    swap.from = event.transaction.from;
    swap.tokenIn = tokenIn;
    swap.amountIn = soldAmount;
    swap.tokenOut = tokenOut;
    swap.amountOut = boughtAmount;
    swap.pool = pool.id;
    swap.save();
}

function handleLiquidityChange(
    event: ethereum.Event,
    provider: Address,
    lpTokenSupply: BigInt,
): void {
    let pool = getOrCreatePool(event.block.number, event.address);

    let liquidityDelta = lpTokenSupply.minus(pool.liquidity);
    if (liquidityDelta.isZero()) return;

    pool.liquidity = lpTokenSupply;
    updateTokenTvls(event.block.number, pool);
    pool.save();

    let position = getOrCreatePosition(event.address, provider);
    position.liquidity = position.liquidity.plus(liquidityDelta);
    position.save();

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.delta = liquidityDelta;
    liquidityChange.position = position.id;
    liquidityChange.save();
}

export function handleTokenExchange(event: TokenExchange): void {
    handleSwap(
        event,
        event.params.bought_id.toI32(),
        event.params.tokens_bought,
        event.params.sold_id.toI32(),
        event.params.tokens_sold,
        false,
    );
}

export function handleTokenExchangeUnderlying(
    event: TokenExchangeUnderlying,
): void {
    handleSwap(
        event,
        event.params.bought_id.toI32(),
        event.params.tokens_bought,
        event.params.sold_id.toI32(),
        event.params.tokens_sold,
        true,
    );
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
    );
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOne): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_amount,
    );
}

export function handleRemoveLiquidityImbalance(
    event: RemoveLiquidityImbalance,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
    );
}

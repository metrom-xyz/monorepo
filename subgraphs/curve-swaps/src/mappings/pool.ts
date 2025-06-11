import {
    TokenExchange,
    TokenExchange1,
    TokenExchange2,
    TokenExchangeUnderlying,
} from "../../generated/UnifiedPool/UnifiedPool";
import { Address, BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { getEventId, getOrCreateToken } from "../commons";
import { Swap } from "../../generated/schema";

function handleSwap(
    event: ethereum.Event,
    from: Address,
    boughtId: BigInt,
    soldId: BigInt,
    amountIn: BigInt,
    amountOut: BigInt,
): void {
    const context = dataSource.context();

    const tokenIn = getOrCreateToken(
        changetype<Address>(context.getBytes("token" + soldId.toString())),
    );
    const tokenOut = getOrCreateToken(
        changetype<Address>(context.getBytes("token" + boughtId.toString())),
    );

    const swap = new Swap(getEventId(event));
    swap.timestamp = event.block.timestamp;
    swap.from = from;
    swap.tokenIn = tokenIn.id;
    swap.tokenOut = tokenOut.id;
    swap.amountIn = amountIn;
    swap.amountOut = amountOut;
    swap.save();
}

export function handleStableSwapTokenExchange(event: TokenExchange): void {
    handleSwap(
        event,
        event.params.buyer,
        event.params.bought_id,
        event.params.sold_id,
        event.params.tokens_sold,
        event.params.tokens_bought,
    );
}

export function handleCryptoSwapTokenExchange(event: TokenExchange1): void {
    handleSwap(
        event,
        event.params.buyer,
        event.params.bought_id,
        event.params.sold_id,
        event.params.tokens_sold,
        event.params.tokens_bought,
    );
}

export function handleCryptoSwapNgTokenExchange(event: TokenExchange2): void {
    handleSwap(
        event,
        event.params.buyer,
        event.params.bought_id,
        event.params.sold_id,
        event.params.tokens_sold,
        event.params.tokens_bought,
    );
}

export function handleStableSwapTokenExchangeUnderlying(
    event: TokenExchangeUnderlying,
): void {
    handleSwap(
        event,
        event.params.buyer,
        event.params.bought_id,
        event.params.sold_id,
        event.params.tokens_sold,
        event.params.tokens_bought,
    );
}

import {
    AddLiquidity,
    RemoveLiquidity,
    RemoveLiquidityOne,
    RemoveLiquidityImbalance,
    TokenExchange,
} from "../../generated/Pool/Pool";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { BI_0, getOrCreatePool, getPoolOrThrow } from "../commons";

export function handleTokenExchange(event: TokenExchange): void {
    const pool = getPoolOrThrow(event.address);

    const boughtId = event.params.bought_id.toI32();
    const soldId = event.params.sold_id.toI32();

    const updatedTvls: BigInt[] = [];
    for (let i = 0; i < pool.tokens.length; i++) {
        if (i == boughtId) {
            updatedTvls.push(pool.tvls[i].minus(event.params.tokens_bought));
        } else if (i == soldId) {
            updatedTvls.push(pool.tvls[i].plus(event.params.tokens_sold));
        } else {
            updatedTvls.push(pool.tvls[i]);
        }
    }

    pool.tvls = updatedTvls;
    pool.save();
}

function handleLiquidityChange(
    event: ethereum.Event,
    newLiquidity: BigInt,
    absoluteTokenDeltas: BigInt[],
    remove: bool,
): void {
    const pool = getOrCreatePool(event.address);

    const updatedTvls: BigInt[] = [];
    for (let i = 0; i < pool.tvls.length; i++) {
        const delta = remove
            ? absoluteTokenDeltas[i].neg()
            : absoluteTokenDeltas[i];
        updatedTvls.push(pool.tvls[i].plus(delta));
    }

    pool.liquidity = newLiquidity;
    pool.tvls = updatedTvls;
    pool.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.token_supply,
        event.params.token_amounts,
        false,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.token_supply,
        event.params.token_amounts,
        true,
    );
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOne): void {
    // calculate the new token amounts in the pool before feeding them
    // to the handleLiquidityChange function
    const tokenId = event.params.token_id.toI32();
    const pool = getPoolOrThrow(event.address);

    const absoluteTokenDeltas: BigInt[] = [];
    for (let i = 0; i < pool.tvls.length; i++)
        absoluteTokenDeltas.push(
            i != tokenId ? BI_0 : event.params.coin_amount,
        );

    handleLiquidityChange(
        event,
        event.params.token_supply,
        absoluteTokenDeltas,
        true,
    );
}

export function handleRemoveLiquidityImbalance(
    event: RemoveLiquidityImbalance,
): void {
    handleLiquidityChange(
        event,
        event.params.token_supply,
        event.params.token_amounts,
        true,
    );
}

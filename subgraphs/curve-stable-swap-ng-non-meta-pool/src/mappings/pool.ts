import {
    TokenExchange,
    AddLiquidity,
    RemoveLiquidity,
    RemoveLiquidityOne,
    RemoveLiquidityImbalance,
} from "../../generated/Pool/Pool";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
    getEventId,
    getOrCreatePosition,
    getOrCreatePool,
    getPoolOrThrow,
} from "../commons";
import { LiquidityChange } from "../../generated/schema";
import { DEPOSIT_AND_STAKE_ZIP_ADDRESS } from "../constants";

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
    provider: Address,
    newLiquidity: BigInt,
    newTokenAmounts: BigInt[],
    remove: bool,
): void {
    const pool = remove
        ? getPoolOrThrow(event.address)
        : getOrCreatePool(event.address);

    const liquidityDelta = newLiquidity.minus(pool.liquidity);

    pool.liquidity = newLiquidity;
    pool.tvls = newTokenAmounts;
    pool.save();

    // account for usage of the deposit & stake zip contract
    const resolvedProvider =
        provider == DEPOSIT_AND_STAKE_ZIP_ADDRESS
            ? event.transaction.from
            : provider;

    const position = getOrCreatePosition(event.address, resolvedProvider);
    position.liquidity = position.liquidity.plus(liquidityDelta);
    position.save();

    const liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.delta = liquidityDelta;
    liquidityChange.position = position.id;
    liquidityChange.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        event.params.token_amounts,
        false,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.provider,
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
    const updatedTvls: BigInt[] = [];
    for (let i = 0; i < pool.tokens.length; i++) {
        if (i == tokenId) {
            updatedTvls.push(pool.tvls[i].minus(event.params.coin_amount));
        } else {
            updatedTvls.push(pool.tvls[i]);
        }
    }

    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        updatedTvls,
        true,
    );
}

export function handleRemoveLiquidityImbalance(
    event: RemoveLiquidityImbalance,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        event.params.token_amounts,
        true,
    );
}

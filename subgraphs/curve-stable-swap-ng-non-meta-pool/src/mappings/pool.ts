import {
    AddLiquidity,
    RemoveLiquidity,
    RemoveLiquidityOne,
    RemoveLiquidityImbalance,
    TokenExchange,
} from "../../generated/Pool/Pool";
import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
    ADDRESS_ZERO,
    BI_0,
    getEventId,
    getOrCreatePool,
    getOrCreatePosition,
    getPoolOrThrow,
    getPositionOrThrow,
} from "../commons";
import { Transfer } from "../../generated/Pool/Erc20";
import { LiquidityChange, LiquidityTransfer } from "../../generated/schema";
import {
    DEPOSIT_AND_STAKE_ZAP_ADDRESS,
    ENSO_SHORTCUTS_ADDRESS,
    POOL_ADDRESS,
    STAKING_CONTRACTS,
} from "../constants";

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

export function handleTransfer(event: Transfer): void {
    if (event.params.value.isZero()) return;

    if (event.params.from == ADDRESS_ZERO) {
        const recipient =
            event.params.to == DEPOSIT_AND_STAKE_ZAP_ADDRESS ||
            event.params.to == ENSO_SHORTCUTS_ADDRESS
                ? event.transaction.from
                : event.params.to;

        // mint
        const position = getOrCreatePosition(recipient);
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();

        const change = new LiquidityChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.blockNumber = event.block.number;
        change.position = position.id;
        change.delta = event.params.value;
        change.save();
    } else if (
        event.params.to == ADDRESS_ZERO ||
        event.params.to == ENSO_SHORTCUTS_ADDRESS
    ) {
        // burn
        const position = getOrCreatePosition(event.params.from);
        position.liquidity = position.liquidity.minus(event.params.value);
        position.save();

        const change = new LiquidityChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.blockNumber = event.block.number;
        change.position = position.id;
        change.delta = event.params.value.neg();
        change.save();
    } else {
        // transfer

        if (
            STAKING_CONTRACTS.includes(event.params.from) ||
            STAKING_CONTRACTS.includes(event.params.to)
        )
            return;

        const fromPosition = getPositionOrThrow(event.params.from);
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        const toPosition = getOrCreatePosition(event.params.to);
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();

        const transfer = new LiquidityTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.blockNumber = event.block.number;
        transfer.pool = changetype<Bytes>(POOL_ADDRESS);
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.save();
    }
}

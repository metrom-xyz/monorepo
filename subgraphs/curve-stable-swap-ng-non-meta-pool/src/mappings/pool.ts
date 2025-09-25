import {
    AddLiquidity,
    RemoveLiquidity,
    RemoveLiquidityOne,
    RemoveLiquidityImbalance,
    TokenExchange,
    Transfer,
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
    getStakingTx,
} from "../commons";
import { LiquidityChange, LiquidityTransfer } from "../../generated/schema";
import { DEPOSIT_AND_STAKE_ZAP_ADDRESS, STAKING_CONTRACTS } from "../constants";

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
    // handle staking transactions
    const stakingTx = getStakingTx();
    if (!!stakingTx.hash && event.transaction.hash == stakingTx.hash!) return;

    if (
        STAKING_CONTRACTS.includes(event.params.sender) ||
        STAKING_CONTRACTS.includes(event.params.receiver)
    ) {
        stakingTx.hash = event.transaction.hash;
        stakingTx.save();
        return;
    } else {
        stakingTx.hash = null;
        stakingTx.save();
    }

    if (event.params.receiver == DEPOSIT_AND_STAKE_ZAP_ADDRESS) {
        // handle deposit & stake transactions (treat this as a mint to the tx's sender)
        const position = getOrCreatePosition(
            event.address,
            event.transaction.from,
        );
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else if (event.params.sender == ADDRESS_ZERO) {
        // lp token mint
        const position = getOrCreatePosition(
            event.address,
            event.params.receiver,
        );
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else if (event.params.receiver == ADDRESS_ZERO) {
        // lp token burn
        const position = getOrCreatePosition(
            event.address,
            event.params.sender,
        );
        position.liquidity = position.liquidity.minus(event.params.value);
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value.neg();
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else {
        const fromPosition = getPositionOrThrow(
            event.address,
            event.params.sender,
        );
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        const toPosition = getOrCreatePosition(
            event.address,
            event.params.receiver,
        );
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();

        const transfer = new LiquidityTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.blockNumber = event.block.number;
        transfer.pool = changetype<Bytes>(event.address);
        transfer.from = event.params.sender;
        transfer.to = event.params.receiver;
        transfer.amount = event.params.value;
        transfer.save();
    }
}

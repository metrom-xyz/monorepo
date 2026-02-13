import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import {
    BalanceTransfer,
    Burn,
    Mint,
} from "../../generated/templates/AToken/AToken";
import {
    processRebasingTokenBalanceChange,
    getUpdateBlock,
    rayMul,
} from "../commons";

export function handleMint(event: Mint): void {
    processRebasingTokenBalanceChange(
        event.params.onBehalfOf,
        event.params.value,
        event.params.balanceIncrease,
        event.params.index,
        event,
    );
}

export function handleBurn(event: Burn): void {
    processRebasingTokenBalanceChange(
        event.params.from,
        event.params.value.neg(),
        event.params.balanceIncrease,
        event.params.index,
        event,
    );
}

export function handleBalanceTransfer(event: BalanceTransfer): void {
    const value =
        event.block.number > getUpdateBlock(dataSource.network())
            ? rayMul(event.params.value, event.params.index)
            : event.params.value;

    processRebasingTokenBalanceChange(
        event.params.from,
        value.neg(),
        BigInt.fromI32(0),
        event.params.index,
        event,
    );
    processRebasingTokenBalanceChange(
        event.params.to,
        value,
        BigInt.fromI32(0),
        event.params.index,
        event,
    );
}

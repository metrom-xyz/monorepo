import { Transfer as TransferEvent } from "../../generated/templates/LpToken/Erc20";
import {
    ADDRESS_ZERO,
    getEventId,
    getOrCreatePosition,
    getPositionOrThrow,
} from "../commons";
import { LiquidityChange, LiquidityTransfer } from "../../generated/schema";
import { POOL_ADDRESS, TRANSPARENT_ADDRESSES } from "../constants";

export function handleTransfer(event: TransferEvent): void {
    if (
        TRANSPARENT_ADDRESSES.includes(event.params.from) ||
        TRANSPARENT_ADDRESSES.includes(event.params.to)
    )
        return;

    if (event.params.from == ADDRESS_ZERO) {
        // mint scenario
        let position = getOrCreatePosition(POOL_ADDRESS, event.params.to);
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else if (event.params.to == ADDRESS_ZERO) {
        // burn scenario
        let position = getPositionOrThrow(POOL_ADDRESS, event.params.from);
        position.liquidity = position.liquidity.minus(event.params.value);
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else {
        let transfer = new LiquidityTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.blockNumber = event.block.number;
        transfer.pool = event.address;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.save();

        let fromPosition = getPositionOrThrow(POOL_ADDRESS, event.params.from);
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        let toPosition = getOrCreatePosition(POOL_ADDRESS, event.params.to);
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();
    }
}

import { Transfer as TransferEvent } from "../../generated/templates/LpToken/Erc20";
import {
    ADDRESS_ZERO,
    getEventId,
    getOrCreatePosition,
    getPositionOrThrow,
} from "../commons";
import { LiquidityTransfer } from "../../generated/schema";
import {
    DEPOSIT_AND_STAKE_ZIP_ADDRESS,
    GAUGE_ADDRESS,
    POOL_ADDRESS,
} from "../constants";

export function handleTransfer(event: TransferEvent): void {
    // here we only handle liq transfers, as additions/removals are handled
    // in the pool handlers. We also make gauge deposits and stake and deposit
    // calls transparent
    if (
        event.params.from == ADDRESS_ZERO ||
        event.params.to == ADDRESS_ZERO ||
        event.params.from == GAUGE_ADDRESS ||
        event.params.to == GAUGE_ADDRESS ||
        event.params.from == DEPOSIT_AND_STAKE_ZIP_ADDRESS ||
        event.params.to == DEPOSIT_AND_STAKE_ZIP_ADDRESS
    ) {
        return;
    }

    let fromPosition = getPositionOrThrow(POOL_ADDRESS, event.params.from);

    if (!event.params.value.isZero()) {
        let liquidityTransfer = new LiquidityTransfer(getEventId(event));
        liquidityTransfer.timestamp = event.block.timestamp;
        liquidityTransfer.blockNumber = event.block.number;
        liquidityTransfer.from = event.params.from;
        liquidityTransfer.to = event.params.to;
        liquidityTransfer.amount = event.params.value;
        liquidityTransfer.pool = POOL_ADDRESS;
        liquidityTransfer.save();
    }

    fromPosition.liquidity = fromPosition.liquidity.minus(event.params.value);
    fromPosition.save();

    let toPosition = getOrCreatePosition(POOL_ADDRESS, event.params.to);
    toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
    toPosition.save();
}

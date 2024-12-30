import { Transfer as TransferEvent } from "../../generated/templates/LPToken/StableSwapLPToken";
import {
    ADDRESS_ZERO,
    getEventId,
    getOrCreatePosition,
    getPositionOrThrow,
} from "../commons";
import { LiquidityTransfer } from "../../generated/schema";
import { Address, dataSource } from "@graphprotocol/graph-ts";
import { MASTERCHEF_V2_ADDRESS } from "../addresses";

export function handleTransfer(event: TransferEvent): void {
    // here we only handle liq transfers, as additions/removals are handled
    // in the pool handlers
    if (event.params.from == ADDRESS_ZERO || event.params.to == ADDRESS_ZERO) {
        return;
    }

    let context = dataSource.context();
    let poolAddress = changetype<Address>(context.getBytes("pool-address"));

    if (!event.params.value.isZero()) {
        let liquidityTransfer = new LiquidityTransfer(getEventId(event));
        liquidityTransfer.timestamp = event.block.timestamp;
        liquidityTransfer.blockNumber = event.block.number;
        liquidityTransfer.transactionHash = event.transaction.hash;
        liquidityTransfer.from = event.params.from;
        liquidityTransfer.to = event.params.to;
        liquidityTransfer.amount = event.params.value;
        liquidityTransfer.pool = poolAddress;
        liquidityTransfer.save();
    }

    // If liquidity is being staked or unstaked we ignore that
    if (
        event.params.to == MASTERCHEF_V2_ADDRESS ||
        event.params.from == MASTERCHEF_V2_ADDRESS
    )
        return;

    let fromPosition = getPositionOrThrow(poolAddress, event.params.from);
    fromPosition.liquidity = fromPosition.liquidity.minus(event.params.value);
    fromPosition.save();

    let toPosition = getOrCreatePosition(poolAddress, event.params.to);
    toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
    toPosition.save();
}

import { Transfer as TransferEvent } from "../../generated/templates/LPToken/StableSwapLPToken";
import {
    ADDRESS_ZERO,
    getEventId,
    getOrCreatePosition,
    getPositionOrThrow,
} from "../commons";
import { LiquidityChange } from "../../generated/schema";
import { Address, dataSource } from "@graphprotocol/graph-ts";
import { MASTERCHEF_V2_ADDRESS } from "../addresses";

export function handleTransfer(event: TransferEvent): void {
    // here we only handle liq transfers, as additions/removals are handled
    // in the pool handlers
    if (
        event.params.from == ADDRESS_ZERO ||
        event.params.to == ADDRESS_ZERO ||
        event.params.from == MASTERCHEF_V2_ADDRESS ||
        event.params.to == MASTERCHEF_V2_ADDRESS
    ) {
        return;
    }

    let context = dataSource.context();
    let poolAddress = changetype<Address>(context.getBytes("pool-address"));

    let fromPosition = getPositionOrThrow(poolAddress, event.params.from);
    fromPosition.liquidity = fromPosition.liquidity.minus(event.params.value);
    fromPosition.save();

    let toPosition = getOrCreatePosition(poolAddress, event.params.to);
    toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
    toPosition.save();

    if (!event.params.value.isZero()) {
        let fromLiquidityChange = new LiquidityChange(getEventId(event));
        fromLiquidityChange.timestamp = event.block.timestamp;
        fromLiquidityChange.blockNumber = event.block.number;
        fromLiquidityChange.transactionHash = event.transaction.hash;
        fromLiquidityChange.delta = event.params.value.neg();
        fromLiquidityChange.position = fromPosition.id;
        fromLiquidityChange.save();

        let toLiquidityChange = new LiquidityChange(getEventId(event));
        toLiquidityChange.timestamp = event.block.timestamp;
        toLiquidityChange.blockNumber = event.block.number;
        toLiquidityChange.transactionHash = event.transaction.hash;
        toLiquidityChange.delta = event.params.value;
        toLiquidityChange.position = toPosition.id;
        toLiquidityChange.save();
    }
}

import { Transfer as TransferEvent } from "../../generated/templates/LpToken/Erc20";
import {
    ADDRESS_ZERO,
    getEventId,
    getOrCreatePosition,
    getPositionId,
} from "../commons";
import { Gauge, LiquidityTransfer, Position } from "../../generated/schema";
import { Address, dataSource } from "@graphprotocol/graph-ts";

export function handleTransfer(event: TransferEvent): void {
    // here we only handle liq transfers, as additions/removals are handled
    // in the pool handlers
    if (
        event.params.from == ADDRESS_ZERO ||
        event.params.to == ADDRESS_ZERO ||
        Gauge.load(event.params.from) !== null ||
        Gauge.load(event.params.to) !== null
    ) {
        return;
    }

    let context = dataSource.context();
    let poolAddress = changetype<Address>(context.getBytes("pool-address"));

    let fromPosition = Position.load(
        getPositionId(poolAddress, event.params.from),
    );
    // the from position might be null in some cases, especially for older pools, as
    // the lp token contract was deployed before the amm one and some operations
    // were done on it before the first amm operation, so we bail here
    if (fromPosition === null) return;

    if (!event.params.value.isZero()) {
        let liquidityTransfer = new LiquidityTransfer(getEventId(event));
        liquidityTransfer.timestamp = event.block.timestamp;
        liquidityTransfer.blockNumber = event.block.number;
        liquidityTransfer.from = event.params.from;
        liquidityTransfer.to = event.params.to;
        liquidityTransfer.amount = event.params.value;
        liquidityTransfer.pool = poolAddress;
        liquidityTransfer.save();
    }

    fromPosition.liquidity = fromPosition.liquidity.minus(event.params.value);
    fromPosition.save();

    let toPosition = getOrCreatePosition(poolAddress, event.params.to);
    toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
    toPosition.save();
}

import { Address } from "@graphprotocol/graph-ts";
import { Transfer } from "../../generated/Voucher/Voucher";
import { LiquidityTransfer } from "../../generated/schema";
import { getEventId, getPositionOrThrow } from "../commons";

export function handleTransfer(event: Transfer): void {
    if (event.params.from == Address.zero()) return;

    let position = getPositionOrThrow(event.params.tokenId);
    position.owner = event.params.to;
    position.save();

    let liquidityTransfer = new LiquidityTransfer(getEventId(event));
    liquidityTransfer.timestamp = event.block.timestamp;
    liquidityTransfer.blockNumber = event.block.number;
    liquidityTransfer.from = event.params.from;
    liquidityTransfer.to = event.params.to;
    liquidityTransfer.position = position.id;
    liquidityTransfer.save();
}

import { Address, dataSource } from "@graphprotocol/graph-ts";
import { TroveTransfer } from "../../generated/schema";
import { Transfer as TransferEvent } from "../../generated/templates/TroveManager/TroveNFT";
import { getEventId, getTroveOrThrow } from "../commons";

export function handleTroveTransfer(event: TransferEvent): void {
    // The trove's opening is taken care of in the trove manager handler
    if (event.params.from == Address.zero()) return;

    let collateralId = dataSource.context().getBytes("collateralId");

    let trove = getTroveOrThrow(collateralId, event.params.tokenId);

    trove.owner = event.params.to;
    trove.save();

    let troveTransfer = new TroveTransfer(getEventId(event));
    troveTransfer.timestamp = event.block.timestamp;
    troveTransfer.blockNumber = event.block.number;
    troveTransfer.trove = trove.id;
    troveTransfer.from = event.params.from;
    troveTransfer.to = event.params.to;
    troveTransfer.save();
}

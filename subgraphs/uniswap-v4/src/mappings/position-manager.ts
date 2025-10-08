import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../../generated/PositionManager/PositionManager";
import { LiquidityTransfer, Position } from "../../generated/schema";
import {
    getEventId,
    getNftPositionId,
    getOrCreateNftPosition,
} from "../commons";

function getNftPositionOrThrow(tokenId: BigInt): Position {
    const position = Position.load(getNftPositionId(tokenId));
    if (position != null) return position;

    throw new Error(`No NFT position for token with id ${tokenId.toU32()}`);
}

export function handleTransfer(event: TransferEvent): void {
    if (event.params.from == Address.zero()) {
        const position = getOrCreateNftPosition(event.params.id);
        position.owner = event.params.to;
        position.save();
    } else if (event.params.to != Address.zero()) {
        const position = getNftPositionOrThrow(event.params.id);
        position.owner = event.params.to;
        position.save();

        const liquidityTransfer = new LiquidityTransfer(getEventId(event));
        liquidityTransfer.timestamp = event.block.timestamp;
        liquidityTransfer.blockNumber = event.block.number;
        liquidityTransfer.from = event.params.from;
        liquidityTransfer.to = event.params.to;
        liquidityTransfer.position = position.id;
        liquidityTransfer.save();
    }
}

import { ethereum } from "@graphprotocol/graph-ts";
import { Block } from "../generated/schema";

export function handleBlock(block: ethereum.Block): void {
    let entity = new Block(block.hash);
    entity.number = block.number;
    entity.timestamp = block.timestamp;
    entity.save();
}

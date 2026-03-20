import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../../generated/PositionManager/PositionManager";
import { _NftMint, Position } from "../../generated/schema";
import { getNftPositionId } from "../commons";

function getNftPositionOrThrow(tokenId: BigInt): Position {
    const position = Position.load(getNftPositionId(tokenId));
    if (position != null) return position;

    throw new Error(`No NFT position for token with id ${tokenId.toU32()}`);
}

export function handleTransfer(event: TransferEvent): void {
    if (event.params.from == Address.zero()) {
        const mint = new _NftMint(
            Bytes.fromByteArray(Bytes.fromBigInt(event.params.id)),
        );
        mint.owner = event.params.to;
        mint.save();
    } else if (event.params.to != Address.zero()) {
        const position = getNftPositionOrThrow(event.params.id);
        position.owner = event.params.to;
        position.save();
    }
}

import { Trade } from "../../generated/GPv2Settlement/GPv2Settlement";
import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { getEventId, getOrCreateToken } from "../commons";
import { Swap } from "../../generated/schema";

export function handleTrade(event: Trade): void {
    const context = dataSource.context();

    const targetToken = getOrCreateToken(
        changetype<Address>(context.getBytes("targetToken")),
    );

    let tokenDelta: BigInt;
    if (event.params.buyToken == targetToken.id) {
        tokenDelta = event.params.buyAmount;
    } else if (event.params.sellToken == targetToken.id) {
        tokenDelta = event.params.sellAmount.neg();
    } else {
        return;
    }

    const swap = new Swap(getEventId(event));
    swap.timestamp = event.block.timestamp;
    swap.from = event.params.owner;
    swap.tokenDelta = tokenDelta;
    swap.save();
}

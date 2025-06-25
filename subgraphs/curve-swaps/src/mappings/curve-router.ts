import { Exchange } from "../../generated/CurveRouter/CurveRouter";
import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { getEventId, getOrCreateToken } from "../commons";
import { Swap } from "../../generated/schema";

export function handleExchange(event: Exchange): void {
    const context = dataSource.context();

    const targetToken = getOrCreateToken(
        changetype<Address>(context.getBytes("targetToken")),
    );

    // in the route array, the first token is always the one
    // being sold, the last one is always the one being bought,
    // but we need to normalize first

    const normalizedRoute: Address[] = [];
    for (let i = 0; i < event.params.route.length; i++) {
        if (event.params.route[i] == Address.zero()) break;
        normalizedRoute.push(event.params.route[i]);
    }

    let tokenDelta: BigInt;
    if (normalizedRoute[normalizedRoute.length - 1] == targetToken.id) {
        tokenDelta = event.params.out_amount;
    } else if (normalizedRoute[0] == targetToken.id) {
        tokenDelta = event.params.in_amount.neg();
    } else {
        return;
    }

    const swap = new Swap(getEventId(event));
    swap.timestamp = event.block.timestamp;
    swap.from = event.params.sender;
    swap.tokenDelta = tokenDelta;
    swap.save();
}

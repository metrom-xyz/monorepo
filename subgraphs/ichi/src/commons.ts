import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";

export const BI_0 = BigInt.zero();

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Transfer } from "../../generated/chUSD/chUSD";
import { Event } from "../../generated/schema";

const ADDRESS_0 = Address.zero();

export function handleTransfer(event: Transfer): void {
    // we ignore 0-value operations and transfers, we only care about mints and burns
    if (
        event.params.value.isZero() ||
        (event.params.from != ADDRESS_0 && event.params.to != ADDRESS_0)
    )
        return;

    const id = changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );

    const burn = event.params.to == ADDRESS_0;

    const created = new Event(id);
    created.timestamp = event.block.timestamp;
    created.from = burn ? event.params.from : event.params.to;
    created.burn = burn;
    created.amount = event.params.value;
    created.save();
}

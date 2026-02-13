import { dataSource } from "@graphprotocol/graph-ts";
import { ReserveDataUpdated } from "../../generated/templates/LendingPool/LendingPool";
import { DATA_SOURCE_CONTEXT_KEY_POOL, getReserveOrThrow } from "../commons";

export function handleReserveDataUpdated(event: ReserveDataUpdated): void {
    const reserve = getReserveOrThrow(
        dataSource.context().getBytes(DATA_SOURCE_CONTEXT_KEY_POOL),
        event.params.reserve,
    );
    reserve.liquidityIndex = event.params.liquidityIndex;
    reserve.variableBorrowIndex = event.params.variableBorrowIndex;
    reserve.save();
}

import {
    PoolAdded,
    PoolRemoved,
} from "../../generated/MainRegistry/MainRegistry";
import { store } from "@graphprotocol/graph-ts";
import { getOrCreatePool } from "../commons";

export function handlePoolAdded(event: PoolAdded): void {
    getOrCreatePool(event.block.number, event.params.pool);
}

export function handlePoolRemoved(event: PoolRemoved): void {
    store.remove("Pool", event.params.pool.toHex());
}

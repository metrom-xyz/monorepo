import { BigInt } from "@graphprotocol/graph-ts";
import { PoolCreated as PoolCreatedEvent } from "../../generated/Factory/Factory";
import { Pool as PoolTemplate } from "../../generated/templates";
import { Pool } from "../../generated/schema";

export function handlePoolCreated(event: PoolCreatedEvent): void {
    let pool = new Pool(event.params.pool);
    // will be updated in the pool's initialize event
    pool.tick = BigInt.zero();
    pool.save();

    PoolTemplate.create(event.params.pool);
}

import { Pool as PoolCreatedEvent } from "../../generated/Factory/Factory";
import { Pool as PoolTemplate } from "../../generated/templates";
import { Pool } from "../../generated/schema";
import { getOrCreateToken } from "../commons";
import { BigInt } from "@graphprotocol/graph-ts";

export function handlePoolCreated(event: PoolCreatedEvent): void {
    let pool = new Pool(event.params.pool);
    // will be updated in the pool's initialize event
    pool.token0 = getOrCreateToken(event.params.token0).id;
    pool.token1 = getOrCreateToken(event.params.token1).id;
    pool.tick = BigInt.zero();
    pool.fee = BigInt.fromU32(100);
    pool.save();

    PoolTemplate.create(event.params.pool);
}

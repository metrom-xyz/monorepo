import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import { PoolCreated as PoolCreatedEvent } from "../../generated/Factory/Factory";
import { Pool } from "../../generated/schema";
import { Pool as PoolTemplate } from "../../generated/templates";
import { BI_0, getOrCreatePoolToken, getOrCreateToken } from "../commons";

export function handlePoolCreated(event: PoolCreatedEvent): void {
    let token0 = getOrCreateToken(event.params.token0);
    if (token0 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 0 at address {}, skipping pool indexing",
            [event.params.token0.toString()],
        );
        return;
    }

    let token1 = getOrCreateToken(event.params.token1);
    if (token1 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 1 at address {}, skipping pool indexing",
            [event.params.token1.toString()],
        );
        return;
    }

    let poolToken0 = getOrCreatePoolToken(
        event.params.pool,
        changetype<Address>(token0.id),
    );
    if (poolToken0 === null) {
        log.warning(
            "Could not create pool token object for token 0 at address {}, skipping pool indexing",
            [event.params.token0.toString()],
        );
        return;
    }

    let poolToken1 = getOrCreatePoolToken(
        event.params.pool,
        changetype<Address>(token1.id),
    );
    if (poolToken1 === null) {
        log.warning(
            "Could not create pool token object for token 1 at address {}, skipping pool indexing",
            [event.params.token1.toString()],
        );
        return;
    }

    let pool = new Pool(event.params.pool);
    pool.tokens = [poolToken0.id, poolToken1.id];
    pool.tick = BI_0;
    pool.fee = BigInt.fromU32(event.params.fee);
    pool.save();

    PoolTemplate.create(event.params.pool);
}

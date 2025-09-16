import { log } from "@graphprotocol/graph-ts";
import { NewPool as NewPoolEvent } from "../../generated/Factory/Factory";
import { Pool } from "../../generated/schema";
import { Pool as PoolTemplate } from "../../generated/templates";
import { BD_0, BI_0, getOrCreateToken } from "../commons";

export function handlePoolCreated(event: NewPoolEvent): void {
    let token0 = getOrCreateToken(event.params.tokenX);
    if (token0 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 0 at address {}, skipping pool indexing",
            [event.params.tokenX.toString()],
        );
        return;
    }

    let token1 = getOrCreateToken(event.params.tokenY);
    if (token1 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 1 at address {}, skipping pool indexing",
            [event.params.tokenY.toString()],
        );
        return;
    }

    let pool = new Pool(event.params.pool);
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.tick = 0;
    pool.price = BD_0;
    pool.sqrtPriceX96 = BI_0;
    pool.fee = event.params.fee;
    pool.liquidity = BI_0;
    pool._stateUpdateBlockNumber = BI_0;
    pool.save();

    PoolTemplate.create(event.params.pool);
}

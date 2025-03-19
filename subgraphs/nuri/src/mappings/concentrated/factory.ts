import { log } from "@graphprotocol/graph-ts";
import { PoolCreated } from "../../../generated/ConcentratedFactory/ConcentratedFactory";
import { ConcentratedPool } from "../../../generated/schema";
import { ConcentratedPool as ConcentratedPoolTemplate } from "../../../generated/templates";
import { BD_0, BI_0, getOrCreateToken } from "../../commons";

export function handlePoolCreated(event: PoolCreated): void {
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

    let pool = new ConcentratedPool(event.params.pool);
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.tick = 0;
    pool.price = BD_0;
    pool.fee = event.params.fee;
    pool.liquidity = BI_0;
    pool.save();

    ConcentratedPoolTemplate.create(event.params.pool);
}

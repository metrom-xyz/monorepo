import { BigInt, DataSourceContext, log } from "@graphprotocol/graph-ts";
import { PoolCreated as PoolCreatedEvent } from "../../generated/Factory/Factory";
import { Pool as PoolTemplate } from "../../generated/templates";
import { Pool } from "../../generated/schema";
import { BD_0, BI_0, getOrCreateToken } from "../commons";

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

    let pool = new Pool(event.params.pool);

    pool.token0 = token0.id;
    pool.token1 = token1.id;

    pool.token0Tvl = BD_0;
    pool.token1Tvl = BD_0;

    pool.tick = BI_0;
    pool.fee = BigInt.fromU32(event.params.fee);

    pool.save();

    let context = new DataSourceContext();
    context.setBigInt("token0Decimals", token0.decimals);
    context.setBigInt("token1Decimals", token1.decimals);

    PoolTemplate.createWithContext(event.params.pool, context);
}

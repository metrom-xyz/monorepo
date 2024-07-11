import { DataSourceContext } from "@graphprotocol/graph-ts";
import { Pool as PoolCreatedEvent } from "../../generated/Factory/Factory";
import { Pool as PoolTemplate } from "../../generated/templates";
import { Pool } from "../../generated/schema";
import { BD_0, BI_0, BI_100, getOrCreateToken } from "../commons";

export function handlePoolCreated(event: PoolCreatedEvent): void {
    let token0 = getOrCreateToken(event.params.token0);
    let token1 = getOrCreateToken(event.params.token1);

    let pool = new Pool(event.params.pool);

    pool.token0 = token0.id;
    pool.token1 = token1.id;

    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;

    pool.token0Price = BD_0;
    pool.token1Price = BD_0;

    pool.tick = BI_0;
    pool.fee = BI_100;

    pool.save();

    let context = new DataSourceContext();
    context.setBigInt("token0Decimals", token0.decimals);
    context.setBigInt("token1Decimals", token1.decimals);

    PoolTemplate.createWithContext(event.params.pool, context);
}

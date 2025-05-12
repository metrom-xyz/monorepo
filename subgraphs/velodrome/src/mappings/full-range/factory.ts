import { log } from "@graphprotocol/graph-ts";
import {
    PoolCreated,
    SetCustomFee,
} from "../../../generated/PoolFactory/PoolFactory";
import { FullRangePool } from "../../../generated/schema";
import { Pool as PoolTemplate } from "../../../generated/templates";
import {
    BD_0,
    BI_0,
    getFullRangePoolOrThrow,
    getOrCreateToken,
    PoolFactoryContract,
} from "../../commons";

export function handleSetCustomFee(event: SetCustomFee): void {
    let pool = getFullRangePoolOrThrow(event.params.pool);
    pool.fee = event.params.fee.toI32();
    pool.save();
}

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

    let pool = new FullRangePool(event.params.pool);
    pool.stable = event.params.stable;
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.price = BD_0;
    pool.liquidity = BI_0;
    pool.fee = PoolFactoryContract.getFee(
        event.params.pool,
        event.params.stable,
    ).toI32();
    pool.save();

    PoolTemplate.create(event.params.pool);
}

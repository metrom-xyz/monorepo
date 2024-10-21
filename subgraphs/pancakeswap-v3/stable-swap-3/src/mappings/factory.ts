import { log } from "@graphprotocol/graph-ts";
import { NewStableSwapPair } from "../../generated/Factory/Factory";
import { Pool as PoolTemplate } from "../../generated/templates";
import { Pool as PoolContract } from "../../generated/templates/Pool/Pool";
import { Pool } from "../../generated/schema";
import { ADDRESS_ZERO, BD_0, BI_0, getOrCreateToken } from "../commons";

export function handleNewStableSwapPair(event: NewStableSwapPair): void {
    if (event.params.tokenC == ADDRESS_ZERO) {
        return;
    }

    let token0 = getOrCreateToken(event.params.tokenA);
    if (token0 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 0 at address {}, skipping pool indexing",
            [event.params.tokenA.toHexString()],
        );
        return;
    }

    let token1 = getOrCreateToken(event.params.tokenB);
    if (token1 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 1 at address {}, skipping pool indexing",
            [event.params.tokenB.toHexString()],
        );
        return;
    }

    let token2 = getOrCreateToken(event.params.tokenC);
    if (token2 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 2 at address {}, skipping pool indexing",
            [event.params.tokenC.toHexString()],
        );
        return;
    }

    let pool = new Pool(event.params.swapContract);
    pool.liquidity = BI_0;
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token2 = token2.id;
    pool.token0Tvl = BD_0;
    pool.token1Tvl = BD_0;
    pool.token2Tvl = BD_0;
    pool.fee = PoolContract.bind(event.params.swapContract).fee();
    pool.save();

    PoolTemplate.create(event.params.swapContract);
}

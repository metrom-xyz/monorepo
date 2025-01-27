import { Bytes, DataSourceContext, log } from "@graphprotocol/graph-ts";
import { NewStableSwapPair } from "../../generated/Factory/Factory";
import { Pool2 as Pool2Template } from "../../generated/templates";
import { Pool3 as Pool3Template } from "../../generated/templates";
import { LPToken as LPTokenTemplate } from "../../generated/templates";
import { Pool2 as Pool2Contract } from "../../generated/templates/Pool2/Pool2";
import { Pool3 as Pool3Contract } from "../../generated/templates/Pool3/Pool3";
import { Pool, Token } from "../../generated/schema";
import { ADDRESS_ZERO, BI_0, getOrCreateToken } from "../commons";

export function handleNewStableSwapPair(event: NewStableSwapPair): void {
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

    let token2: Token | null = null;
    if (event.params.tokenC != ADDRESS_ZERO) {
        token2 = getOrCreateToken(event.params.tokenC);
        if (token2 === null) {
            log.warning(
                "Could not correctly resolve ERC20 token 2 at address {}, skipping pool indexing",
                [event.params.tokenC.toHexString()],
            );
            return;
        }
    }

    let pool = new Pool(event.params.swapContract);
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token2 = token2 !== null ? token2.id : null;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.token2Tvl = token2 !== null ? BI_0 : null;
    pool.fee =
        token2 !== null
            ? Pool3Contract.bind(event.params.swapContract).fee()
            : Pool2Contract.bind(event.params.swapContract).fee();
    pool.liquidity = BI_0;
    pool.save();

    let lpTokenContext = new DataSourceContext();
    lpTokenContext.setBytes(
        "pool-address",
        changetype<Bytes>(event.params.swapContract),
    );
    LPTokenTemplate.createWithContext(event.params.LP, lpTokenContext);

    if (token2 !== null) Pool3Template.create(event.params.swapContract);
    else Pool2Template.create(event.params.swapContract);
}

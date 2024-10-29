import { Address, Bytes, log } from "@graphprotocol/graph-ts";
import { NewStableSwapPair } from "../../generated/Factory/Factory";
import { Pool2 as Pool2Template } from "../../generated/templates";
import { Pool3 as Pool3Template } from "../../generated/templates";
import { Pool2 as Pool2Contract } from "../../generated/templates/Pool2/Pool2";
import { Pool3 as Pool3Contract } from "../../generated/templates/Pool3/Pool3";
import { Pool } from "../../generated/schema";
import {
    ADDRESS_ZERO,
    BI_0,
    getOrCreatePoolToken,
    getOrCreateToken,
} from "../commons";

export function handleNewStableSwapPair(event: NewStableSwapPair): void {
    let tokens: Bytes[] = [];

    let token0 = getOrCreateToken(event.params.tokenA);
    if (token0 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 0 at address {}, skipping pool indexing",
            [event.params.tokenA.toHexString()],
        );
        return;
    }
    let poolToken0 = getOrCreatePoolToken(
        event.params.swapContract,
        changetype<Address>(token0.id),
    );
    if (poolToken0 === null) {
        log.warning(
            "Could not create pool token object for token 0 at address {}, skipping pool indexing",
            [event.params.tokenA.toString()],
        );
        return;
    }
    tokens.push(poolToken0.id);

    let token1 = getOrCreateToken(event.params.tokenB);
    if (token1 === null) {
        log.warning(
            "Could not correctly resolve ERC20 token 1 at address {}, skipping pool indexing",
            [event.params.tokenB.toHexString()],
        );
        return;
    }
    let poolToken1 = getOrCreatePoolToken(
        event.params.swapContract,
        changetype<Address>(token1.id),
    );
    if (poolToken1 === null) {
        log.warning(
            "Could not create pool token object for token 1 at address {}, skipping pool indexing",
            [event.params.tokenB.toString()],
        );
        return;
    }
    tokens.push(poolToken1.id);

    if (event.params.tokenC != ADDRESS_ZERO) {
        let token2 = getOrCreateToken(event.params.tokenC);
        if (token2 === null) {
            log.warning(
                "Could not correctly resolve ERC20 token 2 at address {}, skipping pool indexing",
                [event.params.tokenC.toHexString()],
            );
            return;
        }
        let poolToken2 = getOrCreatePoolToken(
            event.params.swapContract,
            changetype<Address>(token2.id),
        );
        if (poolToken2 === null) {
            log.warning(
                "Could not create pool token object for token 2 at address {}, skipping pool indexing",
                [event.params.tokenC.toString()],
            );
            return;
        }
        tokens.push(poolToken2.id);
    }

    let pool = new Pool(event.params.swapContract);
    pool.tokens = tokens;
    pool.fee =
        tokens.length === 3
            ? Pool3Contract.bind(event.params.swapContract).fee()
            : Pool2Contract.bind(event.params.swapContract).fee();
    pool.liquidity = BI_0;
    pool.save();

    if (tokens.length === 3) Pool3Template.create(event.params.swapContract);
    else Pool2Template.create(event.params.swapContract);
}

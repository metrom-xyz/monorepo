import { log } from "@graphprotocol/graph-ts";
import {
    Initialized,
    PairCreated,
    SetFee,
    SetPairFee,
} from "../../../generated/FullRangeFactory/FullRangeFactory";
import { FullRangeFactory, FullRangePool } from "../../../generated/schema";
import { FullRangePool as FullRangePoolTemplate } from "../../../generated/templates";
import {
    BD_0,
    BI_0,
    getFullRangePoolOrThrow,
    getOrCreateToken,
} from "../../commons";

export function handleInitialized(event: Initialized): void {
    let factory = new FullRangeFactory(event.address);
    factory.stableFee = 5;
    factory.volatileFee = 25;
    factory.save();
}

export function handlePairCreated(event: PairCreated): void {
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

    let factory = FullRangeFactory.load(event.address);
    if (factory === null) throw new Error("No factory");

    let pool = new FullRangePool(event.params.pair);
    pool.stable = event.params.stable;
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.price = BD_0;
    pool.fee = event.params.stable ? factory.stableFee : factory.volatileFee;
    pool.liquidity = BI_0;
    pool.save();

    FullRangePoolTemplate.create(event.params.pair);
}

export function handleSetFee(event: SetFee): void {
    let factory = FullRangeFactory.load(event.address);
    if (factory === null) throw new Error("No factory");

    if (event.params.stable) factory.stableFee = event.params.fee.toI32();
    else factory.volatileFee = event.params.fee.toI32();
    factory.save();
}

export function handlePairFee(event: SetPairFee): void {
    let pool = getFullRangePoolOrThrow(event.params.pair);
    pool.fee = event.params.fee.toI32();
    pool.save();
}

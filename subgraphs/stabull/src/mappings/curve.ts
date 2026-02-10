import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
    Trade as TradeEvent,
    Transfer as TransferEvent,
} from "../../generated/templates/Curve/Curve";
import {
    getOrCreatePosition,
    getPoolOrThrow,
    getPositionOrThrow,
    getTokenOrThrow,
    updatePoolTvlAndSave,
    ZERO_ADDRESS,
} from "../commons";

export function handleTrade(event: TradeEvent): void {
    const pool = getPoolOrThrow(event.address);

    const token0 = getTokenOrThrow(changetype<Address>(pool.token0));
    const token1 = getTokenOrThrow(changetype<Address>(pool.token1));

    let token0Amount: BigDecimal;
    let token1Amount: BigDecimal;
    if (event.params.origin == token0.id) {
        // swap token0 -> token1
        token0Amount = event.params.originAmount.toBigDecimal().div(
            BigInt.fromI32(10)
                .pow(<u8>token0.decimals)
                .toBigDecimal(),
        );
        token1Amount = event.params.targetAmount.toBigDecimal().div(
            BigInt.fromI32(10)
                .pow(<u8>token1.decimals)
                .toBigDecimal(),
        );
    } else if (event.params.origin == token1.id) {
        // swap token1 -> token0
        token0Amount = event.params.targetAmount.toBigDecimal().div(
            BigInt.fromI32(10)
                .pow(<u8>token0.decimals)
                .toBigDecimal(),
        );
        token1Amount = event.params.originAmount.toBigDecimal().div(
            BigInt.fromI32(10)
                .pow(<u8>token1.decimals)
                .toBigDecimal(),
        );
    } else {
        throw new Error("noop");
    }

    pool.price = token1Amount.div(token0Amount);

    updatePoolTvlAndSave(pool, event.block);
}

export function handleTransfer(event: TransferEvent): void {
    const pool = getPoolOrThrow(event.address);

    if (event.params.from == ZERO_ADDRESS) {
        // mint
        log.debug("Handling mint for {}", [event.params.to.toHex()]);

        pool.liquidity = pool.liquidity.plus(event.params.value);

        const position = getOrCreatePosition(event.address, event.params.to);
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();
    } else if (event.params.to == ZERO_ADDRESS) {
        // burn
        log.debug("Handling burn for {}", [event.params.from.toHex()]);

        pool.liquidity = pool.liquidity.minus(event.params.value);

        // skip handling the initial liquidity burn for the pools
        if (event.params.from != event.address) {
            const position = getPositionOrThrow(
                event.address,
                event.params.from,
            );
            position.liquidity = position.liquidity.minus(event.params.value);
            position.save();
        }
    } else {
        // transfer
        log.debug("Handling transfer from {} to {}", [
            event.params.from.toHex(),
            event.params.to.toHex(),
        ]);

        const fromPosition = getPositionOrThrow(
            event.address,
            event.params.from,
        );
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        const toPosition = getOrCreatePosition(event.address, event.params.to);
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();
    }

    updatePoolTvlAndSave(pool, event.block);
}

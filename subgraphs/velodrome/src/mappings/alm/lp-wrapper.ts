import { Transfer } from "../../../generated/templates/AlmLpWrapper/AlmLpWrapper";
import {
    getAlmStrategyOrThrow,
    getAlmStrategyPositionOrThrow,
    getOrCreateAlmStrategyPosition,
} from "../../commons";
import { Address, dataSource } from "@graphprotocol/graph-ts";

export function handleTransfer(event: Transfer): void {
    if (event.params.value.isZero()) return;

    let poolAddress = changetype<Address>(
        dataSource.context().getBytes("pool"),
    );

    if (event.params.from == Address.zero()) {
        // mint scenario
        let wrapper = getAlmStrategyOrThrow(event.address);
        wrapper.liquidity = wrapper.liquidity.plus(event.params.value);
        wrapper.save();

        let position = getOrCreateAlmStrategyPosition(
            event.address,
            event.params.to,
            poolAddress,
        );
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();
    } else if (event.params.to == Address.zero()) {
        // burn scenario
        let wrapper = getAlmStrategyOrThrow(event.address);
        wrapper.liquidity = wrapper.liquidity.minus(event.params.value);
        wrapper.save();

        let position = getAlmStrategyPositionOrThrow(
            event.address,
            event.params.from,
        );
        position.liquidity = position.liquidity.minus(event.params.value);
        position.save();
    } else {
        let fromPosition = getAlmStrategyPositionOrThrow(
            event.address,
            event.params.from,
        );
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        let toPosition = getOrCreateAlmStrategyPosition(
            event.address,
            event.params.to,
            poolAddress,
        );
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();
    }
}

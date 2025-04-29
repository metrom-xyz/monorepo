import { Transfer } from "../../../generated/templates/AlmLpWrapper/AlmLpWrapper";
import {
    AlmLpWrapperLiquidityChange,
    AlmLpWrapperLiquidityTransfer,
} from "../../../generated/schema";
import {
    getAlmLpWrapperOrThrow,
    getAlmLpWrapperPositionOrThrow,
    getEventId,
    getOrCreateAlmLpWrapperPosition,
} from "../../commons";
import { Address, dataSource } from "@graphprotocol/graph-ts";

export function handleTransfer(event: Transfer): void {
    if (event.params.value.isZero()) return;

    let poolAddress = changetype<Address>(
        dataSource.context().getBytes("pool"),
    );

    if (event.params.from == Address.zero()) {
        // mint scenario
        let wrapper = getAlmLpWrapperOrThrow(event.address);
        wrapper.liquidity = wrapper.liquidity.plus(event.params.value);
        wrapper.save();

        let position = getOrCreateAlmLpWrapperPosition(
            event.address,
            event.params.to,
            poolAddress,
        );
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();

        let liquidityChange = new AlmLpWrapperLiquidityChange(
            getEventId(event),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value;
        liquidityChange.lpWrapper = event.address;
        liquidityChange.pool = poolAddress;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else if (event.params.to == Address.zero()) {
        // burn scenario
        let wrapper = getAlmLpWrapperOrThrow(event.address);
        wrapper.liquidity = wrapper.liquidity.minus(event.params.value);
        wrapper.save();

        let position = getAlmLpWrapperPositionOrThrow(
            event.address,
            event.params.from,
        );
        position.liquidity = position.liquidity.minus(event.params.value);
        position.save();

        let liquidityChange = new AlmLpWrapperLiquidityChange(
            getEventId(event),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value.neg();
        liquidityChange.lpWrapper = event.address;
        liquidityChange.pool = poolAddress;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else {
        let transfer = new AlmLpWrapperLiquidityTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.blockNumber = event.block.number;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.lpWrapper = event.address;
        transfer.pool = poolAddress;
        transfer.save();

        let fromPosition = getAlmLpWrapperPositionOrThrow(
            event.address,
            event.params.from,
        );
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        let toPosition = getOrCreateAlmLpWrapperPosition(
            event.address,
            event.params.to,
            poolAddress,
        );
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();
    }
}

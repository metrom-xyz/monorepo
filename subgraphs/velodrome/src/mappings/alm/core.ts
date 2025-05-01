import { Rebalance } from "../../../generated/AlmCore/AlmCore";
import { getConcentratedPositionOrThrow } from "../../commons";

export function handleRebalance(event: Rebalance): void {
    let previousPosition = getConcentratedPositionOrThrow(
        event.params.rebalanceEventParams.ammPositionIdBefore,
    );
    let newPosition = getConcentratedPositionOrThrow(
        event.params.rebalanceEventParams.ammPositionIdAfter,
    );

    newPosition.owner = previousPosition.owner;
    newPosition.almStrategy = previousPosition.almStrategy;
    newPosition.save();
}

import { dataSource } from "@graphprotocol/graph-ts";
import { DepositedDebtChangeEvent } from "../../generated/schema";
import { DepositUpdated as DepositUpdatedEvent } from "../../generated/templates/StabilityPool/StabilityPool";
import {
    getEventId,
    getOrCreateStabilityPool,
    getOrCreateStabilityPoolPosition,
} from "../commons";

export function handleDepositUpdated(event: DepositUpdatedEvent): void {
    let collateralId = dataSource.context().getBytes("collateralId");
    let pool = getOrCreateStabilityPool(collateralId);

    let position = getOrCreateStabilityPoolPosition(
        pool.id,
        event.params._depositor,
    );

    let delta = event.params._newDeposit.minus(position.deposited);
    if (!delta.isZero()) {
        let depositedDebtChangeEvent = new DepositedDebtChangeEvent(
            getEventId(event),
        );
        depositedDebtChangeEvent.timestamp = event.block.timestamp;
        depositedDebtChangeEvent.blockNumber = event.block.number;
        depositedDebtChangeEvent.pool = pool.id;
        depositedDebtChangeEvent.account = event.params._depositor;
        depositedDebtChangeEvent.delta = delta;
        depositedDebtChangeEvent.save();

        pool.deposited = pool.deposited.plus(delta);
        pool.save();
    }

    position.deposited = event.params._newDeposit;
    position.save();
}

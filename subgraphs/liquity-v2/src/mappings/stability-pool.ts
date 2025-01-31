import { dataSource } from "@graphprotocol/graph-ts";
import { DepositUpdated as DepositUpdatedEvent } from "../../generated/templates/StabilityPool/StabilityPool";
import {
    getCollateralOrThrow,
    getEventId,
    getOrCreateStabilityPoolPosition,
} from "../commons";
import { StabilityPoolDebtChange } from "../../generated/schema";

export function handleDepositUpdated(event: DepositUpdatedEvent): void {
    let collateralId = dataSource.context().getBytes("collateralId");

    let position = getOrCreateStabilityPoolPosition(
        collateralId,
        event.params._depositor,
    );

    let delta = event.params._newDeposit.minus(position.tvl);
    if (!delta.isZero()) {
        let stabilityPoolDebtChange = new StabilityPoolDebtChange(
            getEventId(event),
        );
        stabilityPoolDebtChange.timestamp = event.block.timestamp;
        stabilityPoolDebtChange.blockNumber = event.block.number;
        stabilityPoolDebtChange.collateral = collateralId;
        stabilityPoolDebtChange.position = position.id;
        stabilityPoolDebtChange.delta = delta;
        stabilityPoolDebtChange.save();

        let collateral = getCollateralOrThrow(collateralId);
        collateral.stabilityPoolDebt = collateral.stabilityPoolDebt.plus(delta);
        collateral.save();

        position.tvl = event.params._newDeposit;
        position.save();
    }
}

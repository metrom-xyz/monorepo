import { PositionDeployed as PositionDeployedEvent } from "../../generated/PositionRegistry/PositionRegistry";
import { Position } from "../../generated/schema";
import { Position as PositionTemplate } from "../../generated/templates";
import { ADDRESS_ZERO, BI_0 } from "../commons";

export function handlePositionDeployed(event: PositionDeployedEvent): void {
    const position = new Position(event.params.position);
    position.owner = event.params.owner;
    position.strategyId = event.params.strategyId;
    position.asset = ADDRESS_ZERO;
    position.depositToken = ADDRESS_ZERO;
    position.totalDeposited = BI_0;
    position.borrowToken = ADDRESS_ZERO;
    position.totalBorrowed = BI_0;
    position.save();

    PositionTemplate.create(event.params.position);
}

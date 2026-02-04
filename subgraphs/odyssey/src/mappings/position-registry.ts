import {
    ImplementationUpdated as ImplementationUpdatedEvent,
    IsActiveUpdated as IsActiveUpdatedEvent,
    PositionDeployed as PositionDeployedEvent,
    StrategyAdded as StrategyAddedEvent,
} from "../../generated/PositionRegistry/PositionRegistry";
import { Position, Strategy } from "../../generated/schema";
import { Position as PositionTemplate } from "../../generated/templates";
import { BI_0, getStrategyId, getStrategyOrThrow } from "../commons";

export function handlePositionDeployed(event: PositionDeployedEvent): void {
    const position = new Position(event.params.position);
    position.owner = event.params.owner;
    position.strategyId = event.params.strategyId;
    position.totalAllocated = BI_0;
    position.totalDeposited = BI_0;
    position.totalBorrowed = BI_0;
    position._updatedAtBlock = BI_0;
    position.save();

    PositionTemplate.create(event.params.position);
}

export function handleStrategyAdded(event: StrategyAddedEvent): void {
    const strategy = new Strategy(getStrategyId(event.params.strategyId));
    strategy.implementation = event.params.implementation;
    strategy.active = true;
    strategy.save();
}

export function handleIsActiveUpdated(event: IsActiveUpdatedEvent): void {
    const strategy = getStrategyOrThrow(event.params.strategyId);
    strategy.active = event.params.isActive;
    strategy.save();
}

export function handleImplementationUpdated(
    event: ImplementationUpdatedEvent,
): void {
    const strategy = getStrategyOrThrow(event.params.strategyId);
    strategy.implementation = event.params.newImplementation;
    strategy.save();
}

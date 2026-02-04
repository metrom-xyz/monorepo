import { Position } from "../../generated/schema";
import {
    FeatureCalled,
    PositionClosed,
    PositionOpened,
} from "../../generated/templates/Position/Position";
import {
    BI_0,
    getOrCreateToken,
    getPositionOrThrow,
    updatePositionDataAndSave,
} from "../commons";

export function handlePositionOpened(event: PositionOpened): void {
    const position = getPositionOrThrow(event.address);
    const asset = getOrCreateToken(event.params.asset);
    if (asset === null)
        throw new Error(`Invalid asset ${event.params.asset.toHex()}`);
    position.asset = asset.id;
    position.totalAllocated = event.params.pushed;
    updatePositionDataAndSave(position, event.block);
}

export function handlePositionClosed(event: PositionClosed): void {
    const position = Position.load(event.address)!;
    position.totalAllocated = event.params.pulled;
    position.totalDeposited = BI_0;
    position.totalBorrowed = BI_0;
    position.save();
}

export function handleFeatureCalled(event: FeatureCalled): void {
    const position = getPositionOrThrow(event.address);
    position.totalAllocated = event.params.allocatedAfter;
    updatePositionDataAndSave(position, event.block);
}

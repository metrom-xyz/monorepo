import { TroveManagerAdded as TroveManagerAddedEvent } from "../../generated/templates/CollateralRegistry/CollateralRegistry";
import {
    getOrCreateCollateral,
    getRegistryOrThrow,
    ZERO_ADDRESS,
} from "../commons";

export function handleTroveManagerAdded(event: TroveManagerAddedEvent): void {
    let registry = getRegistryOrThrow(event.address);

    let tokenAddress = event.params.token;
    let troveManagerAddress = event.params.troveManager;

    if (tokenAddress === ZERO_ADDRESS || troveManagerAddress === ZERO_ADDRESS)
        throw new Error(
            "Tried to add a trove manager with an invalid address on a token with an invalid address, skipping",
        );

    getOrCreateCollateral(
        registry.collateralsAmount,
        tokenAddress,
        troveManagerAddress,
        event.address,
    );

    registry.collateralsAmount = registry.collateralsAmount + 1;
    registry.save();
}

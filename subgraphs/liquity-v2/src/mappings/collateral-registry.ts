import { log } from "@graphprotocol/graph-ts";
import { TroveManagerAdded as TroveManagerAddedEvent } from "../../generated/templates/CollateralRegistry/CollateralRegistry";
import { createCollateral, getRegistryOrThrow, ZERO_ADDRESS } from "../commons";

export function handleTroveManagerAdded(event: TroveManagerAddedEvent): void {
    let registry = getRegistryOrThrow(event.address);

    let tokenAddress = event.params.token;
    let troveManagerAddress = event.params.troveManager;

    if (tokenAddress === ZERO_ADDRESS || troveManagerAddress === ZERO_ADDRESS) {
        log.warning(
            "Tried to add a trove manager with an invalid address on a token with an invalid address, skipping",
            [],
        );
        return;
    }

    createCollateral(
        registry.collateralsAmount,
        tokenAddress,
        troveManagerAddress,
        event.address,
    );

    registry.collateralsAmount = registry.collateralsAmount + 1;
    registry.save();
}

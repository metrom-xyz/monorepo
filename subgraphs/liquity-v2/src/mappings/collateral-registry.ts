import { Address } from "@graphprotocol/graph-ts";
import {
    CollateralAdded as CollateralAddedEvent,
    TroveManagerAdded as TroveManagerAddedEvent,
} from "../../generated/templates/CollateralRegistry/CollateralRegistry";
import {
    getOrCreateCollateral,
    getRegistryOrThrow,
    ZERO_ADDRESS,
} from "../commons";

function handleAddCollateral(
    registryAddress: Address,
    tokenAddress: Address,
    troveManagerAddress: Address,
): void {
    let registry = getRegistryOrThrow(registryAddress);

    if (tokenAddress === ZERO_ADDRESS || troveManagerAddress === ZERO_ADDRESS)
        throw new Error(
            "Tried to add a trove manager with an invalid address on a token with an invalid address, skipping",
        );

    getOrCreateCollateral(
        registry.collateralsAmount,
        tokenAddress,
        troveManagerAddress,
        registryAddress,
    );

    registry.collateralsAmount = registry.collateralsAmount + 1;
    registry.save();
}

export function handleTroveManagerAdded(event: TroveManagerAddedEvent): void {
    handleAddCollateral(
        event.address,
        event.params.token,
        event.params.troveManager,
    );
}

export function handleCollateralAdded(event: CollateralAddedEvent): void {
    handleAddCollateral(
        event.address,
        event.params._token,
        event.params._troveManager,
    );
}

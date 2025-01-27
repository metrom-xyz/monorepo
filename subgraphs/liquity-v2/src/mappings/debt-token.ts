import { Address, BigInt } from "@graphprotocol/graph-ts";
import { CollateralRegistryAddressChanged as CollateralRegistryAddressChangedEvent } from "../../generated/DebtToken/DebtToken";
import { CollateralRegistry as CollateralRegistryContract } from "../../generated/DebtToken/CollateralRegistry";
import { CollateralRegistry as CollateralRegistryTemplate } from "../../generated/templates";
import {
    createCollateral,
    getOrCreateRegistry,
    ZERO_ADDRESS,
} from "../commons";

export function handleCollateralRegistryAddressChanged(
    event: CollateralRegistryAddressChangedEvent,
): void {
    let registry = getOrCreateRegistry(
        event.params._newCollateralRegistryAddress,
    );

    let registryContract = CollateralRegistryContract.bind(
        event.params._newCollateralRegistryAddress,
    );
    let totalCollaterals = registryContract.totalCollaterals().toI32();

    for (let index = 0; index < totalCollaterals; index++) {
        let tokenAddress = Address.fromBytes(
            registryContract.getToken(BigInt.fromI32(index)),
        );
        let troveManagerAddress = Address.fromBytes(
            registryContract.getTroveManager(BigInt.fromI32(index)),
        );

        if (
            tokenAddress === ZERO_ADDRESS ||
            troveManagerAddress === ZERO_ADDRESS
        )
            break;

        createCollateral(
            index,
            tokenAddress,
            troveManagerAddress,
            event.params._newCollateralRegistryAddress,
        );
        registry.collateralsAmount = registry.collateralsAmount + 1;
    }

    registry.save();

    CollateralRegistryTemplate.create(
        event.params._newCollateralRegistryAddress,
    );
}

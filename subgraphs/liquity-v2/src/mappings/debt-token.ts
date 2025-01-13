import {
    Address,
    BigInt,
    DataSourceContext,
    log,
} from "@graphprotocol/graph-ts";
import { CollateralRegistryAddressChanged as CollateralRegistryAddressChangedEvent } from "../../generated/DebtToken/DebtToken";
import { CollateralRegistry as CollateralRegistryContract } from "../../generated/DebtToken/CollateralRegistry";
import { TroveManager as TroveManagerContract } from "../../generated/DebtToken/TroveManager";
import { Collateral } from "../../generated/schema";
import {
    StabilityPool as StabilityPoolTemplate,
    TroveManager as TroveManagerTemplate,
} from "../../generated/templates";
import {
    BI_0,
    fetchTokenDecimals,
    fetchTokenName,
    fetchTokenSymbol,
    ZERO_ADDRESS,
} from "../commons";

export function handleCollateralRegistryAddressChanged(
    event: CollateralRegistryAddressChangedEvent,
): void {
    let registry = CollateralRegistryContract.bind(
        event.params._newCollateralRegistryAddress,
    );
    let totalCollaterals = registry.totalCollaterals().toI32();

    for (let index = 0; index < totalCollaterals; index++) {
        let tokenAddress = Address.fromBytes(
            registry.getToken(BigInt.fromI32(index)),
        );
        let troveManagerAddress = Address.fromBytes(
            registry.getTroveManager(BigInt.fromI32(index)),
        );

        if (
            tokenAddress === ZERO_ADDRESS ||
            troveManagerAddress === ZERO_ADDRESS
        )
            break;

        let collateral = Collateral.load(tokenAddress);
        if (collateral !== null) continue;

        let tokenSymbol = fetchTokenSymbol(tokenAddress);
        if (tokenSymbol === null) {
            log.warning(
                "Could not correctly resolve ERC20 collateral token symbol at address {}, skipping indexing",
                [tokenAddress.toString()],
            );
            return;
        }

        let tokenName = fetchTokenName(tokenAddress);
        if (tokenName === null) {
            log.warning(
                "Could not correctly resolve ERC20 collateral token name at address {}, skipping indexing",
                [tokenAddress.toString()],
            );
            return;
        }

        let tokenDecimals = fetchTokenDecimals(tokenAddress);
        if (tokenDecimals === null) {
            log.warning(
                "Could not correctly resolve ERC20 collateral token decimals at address {}, skipping indexing",
                [tokenAddress.toString()],
            );
            return;
        }

        collateral = new Collateral(tokenAddress);
        collateral.name = tokenName;
        collateral.symbol = tokenSymbol;
        collateral.decimals = tokenDecimals;
        collateral.index = index;
        collateral.deposited = BI_0;
        collateral.debt = BI_0;
        collateral.save();

        let troveManagerContract =
            TroveManagerContract.bind(troveManagerAddress);

        let context = new DataSourceContext();
        context.setBytes("address:troveNft", troveManagerContract.troveNFT());
        context.setBytes("collateralId", collateral.id);

        TroveManagerTemplate.createWithContext(troveManagerAddress, context);
        StabilityPoolTemplate.createWithContext(
            Address.fromBytes(troveManagerContract.stabilityPool()),
            context,
        );
    }
}

import { Address, BigInt } from "@graphprotocol/graph-ts";
import { getOrCreateCollateral } from "../commons";
import {
    DecreasePoolAmount,
    DecreaseUsdgAmount,
    IncreasePoolAmount,
    IncreaseUsdgAmount,
} from "../../generated/Vault/Vault";

function handleTokenChange(collateralAddress: Address, delta: BigInt): void {
    const collateral = getOrCreateCollateral(collateralAddress);
    collateral.tvl = collateral.tvl.plus(delta);
    collateral.save();
}

function handleUsdgChange(collateralAddress: Address, delta: BigInt): void {
    const collateral = getOrCreateCollateral(collateralAddress);
    collateral.usdTvl = collateral.usdTvl.plus(delta);
    collateral.save();
}

export function handleIncreasePoolAmount(event: IncreasePoolAmount): void {
    handleTokenChange(event.params.token, event.params.amount);
}

export function handleDecreasePoolAmount(event: DecreasePoolAmount): void {
    handleTokenChange(event.params.token, event.params.amount.neg());
}

export function handleIncreaseUsdgAmount(event: IncreaseUsdgAmount): void {
    handleUsdgChange(event.params.token, event.params.amount);
}

export function handleDecreaseUsdgAmount(event: DecreaseUsdgAmount): void {
    handleUsdgChange(event.params.token, event.params.amount.neg());
}

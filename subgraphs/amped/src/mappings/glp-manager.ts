import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { LiquidityChange, Position } from "../../generated/schema";
import { BI_0, getEventId, getOrCreateCollateral } from "../commons";
import {
    AddLiquidity,
    RemoveLiquidity,
} from "../../generated/GlpManager/GlpManager";
import { YALP_VAULT_ADDRESS } from "../addresses";

const BI_10_E_18 = BigInt.fromI32(10).pow(18);

function getOrCreatePosition(owner: Address, collateral: Address): Position {
    const id = collateral.concat(owner);
    let position = Position.load(id);
    if (position !== null) return position;

    position = new Position(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.collateral = collateral;
    position.vault = owner === YALP_VAULT_ADDRESS ? YALP_VAULT_ADDRESS : null;
    position.save();

    return position;
}

function handleLiquidityChange(
    event: ethereum.Event,
    ownerAddress: Address,
    collateralAddress: Address,
    usdgAmount: BigInt,
    glpDelta: BigInt,
): void {
    const liquidityDelta = usdgAmount.times(BI_10_E_18).div(glpDelta);

    const collateral = getOrCreateCollateral(collateralAddress);
    collateral.liquidity = collateral.liquidity.plus(liquidityDelta);
    collateral.save();

    const position = getOrCreatePosition(ownerAddress, collateralAddress);
    position.liquidity = position.liquidity.plus(liquidityDelta);
    position.save();

    const change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.position = position.id;
    change.delta = liquidityDelta;
    change.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.account,
        event.params.token,
        event.params.usdgAmount,
        event.params.mintAmount,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.account,
        event.params.token,
        event.params.usdgAmount,
        event.params.glpAmount,
    );
}

import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { LiquidityChange, Position } from "../../generated/schema";
import { BI_0, getEventId, getOrCreateCollateral } from "../commons";
import {
    AddLiquidity,
    RemoveLiquidity,
} from "../../generated/GlpManager/GlpManager";
import { TOKENIZED_VAULT_COLLATERAL } from "../addresses";

function getOrCreatePosition(owner: Address, collateral: Address): Position {
    const id = collateral.concat(owner);
    let position = Position.load(id);
    if (position !== null) return position;

    position = new Position(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.collateral = collateral;
    position.tokenizedVault = TOKENIZED_VAULT_COLLATERAL.isSet(owner)
        ? owner
        : null;
    position.save();

    return position;
}

function handleLiquidityChange(
    event: ethereum.Event,
    ownerAddress: Address,
    collateralAddress: Address,
    glpDelta: BigInt,
): void {
    const collateral = getOrCreateCollateral(collateralAddress);
    collateral.liquidity = collateral.liquidity.plus(glpDelta);
    collateral.save();

    const position = getOrCreatePosition(ownerAddress, collateralAddress);
    position.liquidity = position.liquidity.plus(glpDelta);
    position.save();

    const change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.owner = position.owner;
    change.positionId = position.id;
    change.tokenizedVaultId = position.tokenizedVault;
    change.delta = glpDelta;
    change.collateral = collateralAddress;
    change.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.account,
        event.params.token,
        event.params.mintAmount,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.account,
        event.params.token,
        event.params.glpAmount.neg(),
    );
}

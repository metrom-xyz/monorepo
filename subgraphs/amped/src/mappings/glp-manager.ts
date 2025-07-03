import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { LiquidityChange } from "../../generated/schema";
import { getEventId, getOrCreatePosition } from "../commons";
import {
    AddLiquidity,
    RemoveLiquidity,
} from "../../generated/GlpManager/GlpManager";

function handleLiquidityChange(
    event: ethereum.Event,
    ownerAddress: Address,
    glpDelta: BigInt,
): void {
    const position = getOrCreatePosition(ownerAddress);
    position.liquidity = position.liquidity.plus(glpDelta);
    position.save();

    const change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.owner = position.id;
    change.tokenizedVaultId = position.tokenizedVault;
    change.delta = glpDelta;
    change.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handleLiquidityChange(event, event.params.account, event.params.mintAmount);
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.account,
        event.params.glpAmount.neg(),
    );
}

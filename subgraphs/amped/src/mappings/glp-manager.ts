import { LiquidityChange } from "../../generated/schema";
import {
    getEventId,
    getOrCreatePosition,
    getPositionOrThrow,
    getUsdTvlDeltaBasedOnPositionState,
} from "../commons";
import {
    AddLiquidity,
    RemoveLiquidity,
} from "../../generated/GlpManager/GlpManager";

export function handleAddLiquidity(event: AddLiquidity): void {
    const position = getOrCreatePosition(event.params.account);
    position.tvl = position.tvl.plus(event.params.mintAmount);
    position.scaledUsdValue = position.scaledUsdValue.plus(
        event.params.usdgAmount,
    );
    position.save();

    const change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.owner = position.id;
    change.tokenizedVaultId = position.tokenizedVault;
    change.tvlDelta = event.params.mintAmount;
    change.scaledUsdValueDelta = event.params.usdgAmount;
    change.save();
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    const position = getPositionOrThrow(event.params.account);

    const tvlAmount = event.params.glpAmount;
    const usdTvlAmount = getUsdTvlDeltaBasedOnPositionState(
        position,
        tvlAmount,
    );

    position.tvl = position.tvl.minus(tvlAmount);
    position.scaledUsdValue = position.scaledUsdValue.minus(usdTvlAmount);
    position.save();

    const change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.owner = position.id;
    change.tokenizedVaultId = position.tokenizedVault;
    change.tvlDelta = tvlAmount.neg();
    change.scaledUsdValueDelta = usdTvlAmount.neg();
    change.save();
}

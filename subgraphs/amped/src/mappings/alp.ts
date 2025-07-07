import { Transfer } from "../../generated/ALP/Erc20";
import { LiquidityTransfer } from "../../generated/schema";
import { FALP_ADDRESS, FSALP_ADDRESS } from "../addresses";
import {
    ADDRESS_ZERO,
    getEventId,
    getOrCreatePosition,
    getPositionOrThrow,
    getUsdTvlDeltaBasedOnPositionState,
} from "../commons";

export function handleTransfer(event: Transfer): void {
    if (
        event.params.value.isZero() ||
        event.params.from == ADDRESS_ZERO ||
        event.params.to == ADDRESS_ZERO ||
        event.params.from == FALP_ADDRESS ||
        event.params.to == FALP_ADDRESS ||
        event.params.from == FSALP_ADDRESS ||
        event.params.to == FSALP_ADDRESS
    )
        return;

    const fromPosition = getPositionOrThrow(event.params.from);

    const tvlValue = event.params.value;
    const usdTvlValue = getUsdTvlDeltaBasedOnPositionState(
        fromPosition,
        tvlValue,
    );

    fromPosition.tvl = fromPosition.tvl.minus(tvlValue);
    fromPosition.scaledUsdValue =
        fromPosition.scaledUsdValue.minus(usdTvlValue);
    fromPosition.save();

    const toPosition = getOrCreatePosition(event.params.to);
    toPosition.tvl = toPosition.tvl.plus(tvlValue);
    toPosition.scaledUsdValue = toPosition.scaledUsdValue.plus(usdTvlValue);
    toPosition.save();

    const change = new LiquidityTransfer(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.from = event.params.from;
    change.to = event.params.to;
    change.tvl = tvlValue;
    change.scaledUsdValue = usdTvlValue;
    change.save();
}

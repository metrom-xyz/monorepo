import { AcceptTransferCall } from "../../generated/RewardRouterV2/RewardRouterV2";
import { LiquidityTransfer } from "../../generated/schema";
import {
    getEventIdFromCall,
    getOrCreatePosition,
    getPositionOrThrow,
} from "../commons";

export function handleAcceptTransfer(call: AcceptTransferCall): void {
    const fromPosition = getPositionOrThrow(call.inputs._sender);

    const tvlValue = fromPosition.tvl;
    const scaledUsdValue = fromPosition.scaledUsdValue;

    fromPosition.tvl = fromPosition.tvl.minus(tvlValue);
    fromPosition.scaledUsdValue =
        fromPosition.scaledUsdValue.minus(scaledUsdValue);
    fromPosition.save();

    const toPosition = getOrCreatePosition(call.from);
    toPosition.tvl = toPosition.tvl.plus(tvlValue);
    toPosition.scaledUsdValue = toPosition.scaledUsdValue.plus(scaledUsdValue);
    toPosition.save();

    const change = new LiquidityTransfer(getEventIdFromCall(call));
    change.timestamp = call.block.timestamp;
    change.from = call.inputs._sender;
    change.to = call.from;
    change.tvl = tvlValue;
    change.scaledUsdValue = scaledUsdValue;
    change.save();
}

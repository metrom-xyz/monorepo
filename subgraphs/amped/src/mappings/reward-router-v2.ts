import { AcceptTransferCall } from "../../generated/RewardRouterV2/RewardRouterV2";
import { BI_0, getOrCreatePosition, getPositionOrThrow } from "../commons";

export function handleAcceptTransfer(call: AcceptTransferCall): void {
    const fromPosition = getPositionOrThrow(call.inputs._sender);
    const transferredLiquidity = fromPosition.liquidity;
    fromPosition.liquidity = BI_0;
    fromPosition.save();

    const toPosition = getOrCreatePosition(call.from);
    toPosition.liquidity = transferredLiquidity;
    toPosition.save();
}

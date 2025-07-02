import { Transfer } from "../../generated/ALP/Erc20";
import { FALP_ADDRESS, FSALP_ADDRESS } from "../addresses";
import {
    ADDRESS_ZERO,
    getOrCreatePosition,
    getPositionOrThrow,
} from "../commons";

export function handleTransfer(event: Transfer): void {
    if (
        event.params.from == ADDRESS_ZERO ||
        event.params.to == ADDRESS_ZERO ||
        event.params.from == FALP_ADDRESS ||
        event.params.to == FALP_ADDRESS ||
        event.params.from == FSALP_ADDRESS ||
        event.params.to == FSALP_ADDRESS
    )
        return;

    const fromPosition = getPositionOrThrow(event.params.from);
    fromPosition.liquidity = fromPosition.liquidity.minus(event.params.value);
    fromPosition.save();

    const toPosition = getOrCreatePosition(event.params.to);
    toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
    toPosition.save();
}

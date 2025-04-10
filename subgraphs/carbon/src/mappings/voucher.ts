import { Address } from "@graphprotocol/graph-ts";
import { Transfer } from "../../generated/Voucher/Voucher";
import { StrategyTransfer } from "../../generated/schema";
import { getEventId, getStrategyOrThrow } from "../commons";

export function handleTransfer(event: Transfer): void {
    if (event.params.from == Address.zero()) return;

    const strategy = getStrategyOrThrow(event.params.tokenId);
    strategy.owner = event.params.to;
    strategy.save();

    const liquidityTransfer = new StrategyTransfer(getEventId(event));
    liquidityTransfer.timestamp = event.block.timestamp;
    liquidityTransfer.from = event.params.from;
    liquidityTransfer.to = event.params.to;
    liquidityTransfer.strategyId = strategy.id;
    liquidityTransfer.save();
}

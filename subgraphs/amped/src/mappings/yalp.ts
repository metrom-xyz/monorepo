import { Address } from "@graphprotocol/graph-ts";
import {
    Deposit,
    Withdraw,
    Transfer,
} from "../../generated/YieldBearingALPVault/YieldBearingALPVault";
import {
    YalpVault,
    YalpPosition,
    YalpPositionChange,
    YalpPositionTransfer,
} from "../../generated/schema";
import { ADDRESS_ZERO, BI_0, getEventId } from "../commons";

function getOrCreateVault(address: Address): YalpVault {
    let vault = YalpVault.load(address);

    if (vault === null) {
        vault = new YalpVault(address);
        vault.shares = BI_0;
        vault.save();
    }

    return vault;
}

function getOrCreatePosition(address: Address): YalpPosition {
    let position = YalpPosition.load(address);

    if (position === null) {
        position = new YalpPosition(address);
        position.shares = BI_0;
        position.save();
    }

    return position;
}

function getPositionOrThrow(address: Address): YalpPosition {
    const position = YalpPosition.load(address);
    if (position !== null) return position;
    throw new Error(`Could not find position for address ${address.toHex()}`);
}

export function handleDeposit(event: Deposit): void {
    const vault = getOrCreateVault(event.address);
    vault.shares = vault.shares.plus(event.params.shares);
    vault.save();

    const position = getOrCreatePosition(event.params.owner);
    position.shares = position.shares.plus(event.params.shares);
    position.save();

    if (!event.params.shares.isZero()) {
        const change = new YalpPositionChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.delta = event.params.shares;
        change.save();
    }
}

export function handleWithdraw(event: Withdraw): void {
    const vault = getOrCreateVault(event.address);
    vault.shares = vault.shares.minus(event.params.shares);
    vault.save();

    const position = getOrCreatePosition(event.params.owner);
    position.shares = position.shares.minus(event.params.shares);
    position.save();

    if (!event.params.shares.isZero()) {
        const change = new YalpPositionChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.delta = event.params.shares.neg();
        change.save();
    }
}

export function handleTransfer(event: Transfer): void {
    if (event.params.from == ADDRESS_ZERO || event.params.to == ADDRESS_ZERO) {
        return;
    }

    const fromPosition = getPositionOrThrow(event.params.from);

    if (!event.params.value.isZero()) {
        const transfer = new YalpPositionTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.save();
    }

    fromPosition.shares = fromPosition.shares.minus(event.params.value);
    fromPosition.save();

    const toPosition = getOrCreatePosition(event.params.to);
    toPosition.shares = toPosition.shares.plus(event.params.value);
    toPosition.save();
}

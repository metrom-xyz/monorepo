import { Address, dataSource } from "@graphprotocol/graph-ts";
import {
    Deposit,
    Withdraw,
    Transfer,
} from "../../generated/YieldBearingALPVault/YieldBearingALPVault";
import {
    TokenizedVault,
    TokenizedVaultPosition,
    TokenizedVaultPositionChange,
    TokenizedVaultPositionTransfer,
} from "../../generated/schema";
import { ADDRESS_ZERO, BI_0, getEventId } from "../commons";

function getOrCreateVault(address: Address): TokenizedVault {
    let vault = TokenizedVault.load(address);

    if (vault === null) {
        vault = new TokenizedVault(address);
        vault.shares = BI_0;
        vault.collateral = dataSource.context().getBytes("collateral");
        vault.save();
    }

    return vault;
}

function getOrCreatePosition(
    vault: Address,
    owner: Address,
): TokenizedVaultPosition {
    let position = TokenizedVaultPosition.load(owner);

    if (position === null) {
        position = new TokenizedVaultPosition(vault.concat(owner));
        position.owner = owner;
        position.shares = BI_0;
        position.collateral = dataSource.context().getBytes("collateral");
        position.vault = vault;
        position.save();
    }

    return position;
}

function getPositionOrThrow(address: Address): TokenizedVaultPosition {
    const position = TokenizedVaultPosition.load(address);
    if (position !== null) return position;
    throw new Error(`Could not find position for address ${address.toHex()}`);
}

export function handleDeposit(event: Deposit): void {
    const vault = getOrCreateVault(event.address);
    vault.shares = vault.shares.plus(event.params.shares);
    vault.save();

    const position = getOrCreatePosition(event.address, event.params.owner);
    position.shares = position.shares.plus(event.params.shares);
    position.save();

    if (!event.params.shares.isZero()) {
        const change = new TokenizedVaultPositionChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.owner = event.params.owner;
        change.delta = event.params.shares;
        change.tokenizedVaultId = event.address;
        change.collateral = dataSource.context().getBytes("collateral");
        change.save();
    }
}

export function handleWithdraw(event: Withdraw): void {
    const vault = getOrCreateVault(event.address);
    vault.shares = vault.shares.minus(event.params.shares);
    vault.save();

    const position = getOrCreatePosition(event.address, event.params.owner);
    position.shares = position.shares.minus(event.params.shares);
    position.save();

    if (!event.params.shares.isZero()) {
        const change = new TokenizedVaultPositionChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.owner = event.params.owner;
        change.delta = event.params.shares.neg();
        change.tokenizedVaultId = event.address;
        change.collateral = dataSource.context().getBytes("collateral");
        change.save();
    }
}

export function handleTransfer(event: Transfer): void {
    if (event.params.from == ADDRESS_ZERO || event.params.to == ADDRESS_ZERO) {
        return;
    }

    const fromPosition = getPositionOrThrow(event.params.from);

    if (!event.params.value.isZero()) {
        const transfer = new TokenizedVaultPositionTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.tokenizedVaultId = event.address;
        transfer.collateral = dataSource.context().getBytes("collateral");
        transfer.save();
    }

    fromPosition.shares = fromPosition.shares.minus(event.params.value);
    fromPosition.save();

    const toPosition = getOrCreatePosition(event.address, event.params.to);
    toPosition.shares = toPosition.shares.plus(event.params.value);
    toPosition.save();
}

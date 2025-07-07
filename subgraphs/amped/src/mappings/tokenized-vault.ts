import { Address, Bytes } from "@graphprotocol/graph-ts";
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

function getOrCreateTokenizedVault(address: Address): TokenizedVault {
    let vault = TokenizedVault.load(address);

    if (vault === null) {
        vault = new TokenizedVault(address);
        vault.shares = BI_0;
        vault.save();
    }

    return vault;
}

function getTokenizedVaultPositionId(vault: Address, owner: Address): Bytes {
    return vault.concat(owner);
}

function getOrCreateTokenizedVaultPosition(
    vault: Address,
    owner: Address,
): TokenizedVaultPosition {
    let id = getTokenizedVaultPositionId(vault, owner);
    let position = TokenizedVaultPosition.load(id);

    if (position === null) {
        position = new TokenizedVaultPosition(id);
        position.owner = owner;
        position.shares = BI_0;
        position.vault = vault;
        position.save();
    }

    return position;
}

function getTokenizedVaultPositionOrThrow(
    vault: Address,
    address: Address,
): TokenizedVaultPosition {
    const position = TokenizedVaultPosition.load(
        getTokenizedVaultPositionId(vault, address),
    );
    if (position !== null) return position;
    throw new Error(
        `Could not find position for address ${address.toHex()} on vault ${vault.toHex()}`,
    );
}

export function handleDeposit(event: Deposit): void {
    const vault = getOrCreateTokenizedVault(event.address);
    vault.shares = vault.shares.plus(event.params.shares);
    vault.save();

    const position = getOrCreateTokenizedVaultPosition(
        event.address,
        event.params.owner,
    );
    position.shares = position.shares.plus(event.params.shares);
    position.save();

    if (!event.params.shares.isZero()) {
        const change = new TokenizedVaultPositionChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.owner = event.params.owner;
        change.delta = event.params.shares;
        change.tokenizedVaultId = event.address;
        change.save();
    }
}

export function handleWithdraw(event: Withdraw): void {
    const vault = getOrCreateTokenizedVault(event.address);
    vault.shares = vault.shares.minus(event.params.shares);
    vault.save();

    const position = getOrCreateTokenizedVaultPosition(
        event.address,
        event.params.owner,
    );
    position.shares = position.shares.minus(event.params.shares);
    position.save();

    if (!event.params.shares.isZero()) {
        const change = new TokenizedVaultPositionChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.owner = event.params.owner;
        change.delta = event.params.shares.neg();
        change.tokenizedVaultId = event.address;
        change.save();
    }
}

export function handleTransfer(event: Transfer): void {
    if (event.params.from == ADDRESS_ZERO || event.params.to == ADDRESS_ZERO) {
        return;
    }

    const fromPosition = getTokenizedVaultPositionOrThrow(
        event.address,
        event.params.from,
    );

    if (!event.params.value.isZero()) {
        const transfer = new TokenizedVaultPositionTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.tokenizedVaultId = event.address;
        transfer.save();
    }

    fromPosition.shares = fromPosition.shares.minus(event.params.value);
    fromPosition.save();

    const toPosition = getOrCreateTokenizedVaultPosition(
        event.address,
        event.params.to,
    );
    toPosition.shares = toPosition.shares.plus(event.params.value);
    toPosition.save();
}

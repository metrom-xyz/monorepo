import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Transfer } from "../../generated/templates/Vault/Vault";
import {
    LiquidityChange,
    LiquidityTransfer,
    Position,
    Vault,
} from "../../generated/schema";
import { BI_0, getEventId } from "../commons";

function getPositionId(vault: Address, owner: Address): Bytes {
    return changetype<Bytes>(vault.concat(owner));
}

function getOrCreatePosition(vault: Address, owner: Address): Position {
    const id = getPositionId(vault, owner);
    let position = Position.load(id);
    if (position === null) {
        position = new Position(id);
        position.owner = owner;
        position.liquidity = BI_0;
        position.vault = vault;
        position.save();
    }
    return position;
}

function getPositionOrThrow(vault: Address, owner: Address): Position {
    const id = getPositionId(vault, owner);
    const position = Position.load(id);
    if (position !== null) return position;

    throw new Error(
        `Could not find position for owner ${owner.toHex()} in vault ${vault.toHex()}`,
    );
}

function getVaultOrThrow(vault: Address): Vault {
    const entity = Vault.load(changetype<Bytes>(vault));
    if (entity !== null) return entity;

    throw new Error(`Could not find vault for address ${vault.toHex()}`);
}

export function handleTransfer(event: Transfer): void {
    if (event.params.from == Address.zero()) {
        // mint
        const vault = getVaultOrThrow(event.address);
        vault.liquidity = vault.liquidity.plus(event.params.value);
        vault.save();

        const position = getOrCreatePosition(event.address, event.params.to);
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();

        const change = new LiquidityChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.blockNumber = event.block.number;
        change.delta = event.params.value;
        change.position = position.id;
        change.vault = event.address;
        change.save();
    } else if (event.params.to == Address.zero()) {
        // burn
        const vault = getVaultOrThrow(event.address);
        vault.liquidity = vault.liquidity.minus(event.params.value);
        vault.save();

        const position = getPositionOrThrow(event.address, event.params.from);
        position.liquidity = position.liquidity.minus(event.params.value);
        position.save();

        const change = new LiquidityChange(getEventId(event));
        change.timestamp = event.block.timestamp;
        change.blockNumber = event.block.number;
        change.delta = event.params.value.neg();
        change.position = position.id;
        change.vault = event.address;
        change.save();
    } else {
        // transfer
        const fromPosition = getPositionOrThrow(
            event.address,
            event.params.from,
        );
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        const toPosition = getOrCreatePosition(event.address, event.params.to);
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();

        const transfer = new LiquidityTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.blockNumber = event.block.number;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.vault = event.address;
        transfer.save();
    }
}

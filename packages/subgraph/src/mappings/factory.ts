import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    Create,
    Initialize,
    TransferOwnership,
    AcceptOwnership,
    SetUpdater,
    SetImplementation,
    SetFeeReceiver,
    SetFee,
} from "../../generated/Factory/Factory";
import {
    AcceptFactoryOwnershipEvent,
    Factory,
    SetFeeEvent,
    SetFeeReceiverEvent,
    SetImplementationEvent,
    SetUpdaterEvent,
    TransferFactoryOwnershipEvent,
} from "../../generated/schema";
import { Campaign as CampaignTemplate } from "../../generated/templates";
import { FACTORY_ADDRESS } from "../addresses";
import {
    getEventId,
    getFactoryOrThrow,
    getOrCreateTransaction,
} from "../commons";

export function handleInitialize(event: Initialize): void {
    // safety check
    if (FACTORY_ADDRESS != event.address)
        throw new Error(
            `Inconsistent factory address: expected ${FACTORY_ADDRESS.toHex()}, got ${event.address.toHex()}`,
        );

    let factory = new Factory(FACTORY_ADDRESS);
    factory.owner = event.params.owner;
    factory.transaction = getOrCreateTransaction(event).id;
    factory.pendingOwner = Address.zero();
    factory.updater = event.params.updater;
    factory.implementation = event.params.implementation;
    factory.feeReceiver = event.params.feeReceiver;
    factory.fee = event.params.fee;
    factory.campaignsAmount = BigInt.zero();
    factory.save();
}

export function handleTransferOwnership(event: TransferOwnership): void {
    let factory = getFactoryOrThrow();
    factory.pendingOwner = event.params.owner;
    factory.save();

    let transferOwnershipEvent = new TransferFactoryOwnershipEvent(
        getEventId(event),
    );
    transferOwnershipEvent.transaction = getOrCreateTransaction(event).id;
    transferOwnershipEvent.factory = factory.id;
    transferOwnershipEvent.owner = event.params.owner;
    transferOwnershipEvent.save();
}

export function handleAcceptOwnership(event: AcceptOwnership): void {
    let factory = getFactoryOrThrow();
    factory.owner = factory.pendingOwner;
    factory.pendingOwner = Address.zero();
    factory.save();

    let acceptOwnershipEvent = new AcceptFactoryOwnershipEvent(
        getEventId(event),
    );
    acceptOwnershipEvent.transaction = getOrCreateTransaction(event).id;
    acceptOwnershipEvent.factory = factory.id;
    acceptOwnershipEvent.owner = factory.owner;
    acceptOwnershipEvent.save();
}

export function handleSetUpdater(event: SetUpdater): void {
    let factory = getFactoryOrThrow();
    factory.updater = event.params.updater;
    factory.save();

    let setUpdaterEvent = new SetUpdaterEvent(getEventId(event));
    setUpdaterEvent.transaction = getOrCreateTransaction(event).id;
    setUpdaterEvent.factory = factory.id;
    setUpdaterEvent.updater = event.params.updater;
    setUpdaterEvent.save();
}

export function handleSetImplementation(event: SetImplementation): void {
    let factory = getFactoryOrThrow();
    factory.implementation = event.params.implementation;
    factory.save();

    let setImplementationEvent = new SetImplementationEvent(getEventId(event));
    setImplementationEvent.transaction = getOrCreateTransaction(event).id;
    setImplementationEvent.factory = factory.id;
    setImplementationEvent.implementation = event.params.implementation;
    setImplementationEvent.save();
}

export function handleSetFeeReceiver(event: SetFeeReceiver): void {
    let factory = getFactoryOrThrow();
    factory.feeReceiver = event.params.feeReceiver;
    factory.save();

    let setFeeReceiverEvent = new SetFeeReceiverEvent(getEventId(event));
    setFeeReceiverEvent.transaction = getOrCreateTransaction(event).id;
    setFeeReceiverEvent.factory = factory.id;
    setFeeReceiverEvent.feeReceiver = event.params.feeReceiver;
    setFeeReceiverEvent.save();
}

export function handleSetFee(event: SetFee): void {
    let factory = getFactoryOrThrow();
    factory.fee = event.params.fee;
    factory.save();

    let setFeeEvent = new SetFeeEvent(getEventId(event));
    setFeeEvent.transaction = getOrCreateTransaction(event).id;
    setFeeEvent.factory = factory.id;
    setFeeEvent.fee = event.params.fee;
    setFeeEvent.save();
}

export function handleCreate(event: Create): void {
    let factory = getFactoryOrThrow();
    factory.campaignsAmount = factory.campaignsAmount.plus(BigInt.fromU32(1));
    factory.save();

    CampaignTemplate.create(event.params.campaign);
}

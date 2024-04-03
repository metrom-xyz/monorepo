import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
    Initialize,
    Claim,
    UpdateTree,
    Recover,
    TransferOwnership,
    AcceptOwnership,
} from "../../generated/templates/Campaign/Campaign";
import {
    AcceptCampaignOwnershipEvent,
    Campaign,
    ClaimEvent,
    InitialReward,
    InitializeCampaignEvent,
    RecoverEvent,
    Reward,
    TransferCampaignOwnershipEvent,
    TreeUpdateEvent,
} from "../../generated/schema";
import {
    getCampaignOrThrow,
    getEventId,
    getFactoryOrThrow,
    getInitialRewardId,
    getOrCreateToken,
    getOrCreateTransaction,
    getRewardId,
    getRewardOrThrow,
} from "../commons";

export function handleInitialize(event: Initialize): void {
    let transaction = getOrCreateTransaction(event);

    let initializeEvent = new InitializeCampaignEvent(getEventId(event));
    initializeEvent.transaction = transaction.id;
    initializeEvent.campaign = event.address;
    initializeEvent.owner = event.params.owner;
    initializeEvent.pool = event.params.pool;
    initializeEvent.from = event.params.from;
    initializeEvent.to = event.params.to;
    initializeEvent.feeReceiver = event.params.feeReceiver;
    initializeEvent.save();

    for (let i = 0; i < event.params.rewards.length; i++) {
        let rewardFromEvent = event.params.rewards[i];
        let token = getOrCreateToken(rewardFromEvent.token);

        let reward = new Reward(
            getRewardId(event.address, rewardFromEvent.token),
        );
        reward.campaign = event.address;
        reward.token = token.id;
        reward.amount = rewardFromEvent.amount;
        reward.unclaimed = rewardFromEvent.amount;
        reward.save();

        let initialReward = new InitialReward(
            getInitialRewardId(event.address, rewardFromEvent.token),
        );
        initialReward.event = initializeEvent.id;
        initialReward.token = token.id;
        initialReward.amount = rewardFromEvent.amount;
        initialReward.fee = rewardFromEvent.fee;
        initialReward.save();
    }

    let campaign = new Campaign(event.address);
    campaign.factory = getFactoryOrThrow().id;
    campaign.transaction = transaction.id;
    campaign.owner = event.params.owner;
    campaign.pendingOwner = Address.zero();
    campaign.pool = event.params.pool;
    campaign.from = event.params.from;
    campaign.to = event.params.to;
    campaign.treeRoot = Bytes.empty();
    campaign.dataHash = Bytes.empty();
    campaign.save();
}

export function handleTransferOwnership(event: TransferOwnership): void {
    let campaign = getCampaignOrThrow(event.address);
    campaign.pendingOwner = event.params.owner;
    campaign.save();

    let transferOwnershipEvent = new TransferCampaignOwnershipEvent(
        getEventId(event),
    );
    transferOwnershipEvent.transaction = getOrCreateTransaction(event).id;
    transferOwnershipEvent.campaign = campaign.id;
    transferOwnershipEvent.owner = event.params.owner;
    transferOwnershipEvent.save();
}

export function handleAcceptOwnership(event: AcceptOwnership): void {
    let campaign = getCampaignOrThrow(event.address);
    campaign.owner = campaign.pendingOwner;
    campaign.pendingOwner = Address.zero();
    campaign.save();

    let acceptOwnershipEvent = new AcceptCampaignOwnershipEvent(
        getEventId(event),
    );
    acceptOwnershipEvent.transaction = getOrCreateTransaction(event).id;
    acceptOwnershipEvent.campaign = campaign.id;
    acceptOwnershipEvent.owner = campaign.owner;
    acceptOwnershipEvent.save();
}

export function handleUpdateTree(event: UpdateTree): void {
    let campaign = getCampaignOrThrow(event.address);
    campaign.treeRoot = event.params.root;
    campaign.dataHash = event.params.dataHash;
    campaign.save();

    let treeUpdateEvent = new TreeUpdateEvent(getEventId(event));
    treeUpdateEvent.transaction = getOrCreateTransaction(event).id;
    treeUpdateEvent.campaign = campaign.id;
    treeUpdateEvent.root = event.params.root;
    treeUpdateEvent.dataHash = event.params.dataHash;
    treeUpdateEvent.save();
}

export function handleClaim(event: Claim): void {
    let reward = getRewardOrThrow(event.address, event.params.token);
    reward.unclaimed = reward.unclaimed.minus(event.params.amount);
    reward.save();

    let campaign = getCampaignOrThrow(event.address);

    let claimEvent = new ClaimEvent(getEventId(event));
    claimEvent.transaction = getOrCreateTransaction(event).id;
    claimEvent.campaign = campaign.id;
    claimEvent.user = event.transaction.from;
    claimEvent.token = getOrCreateToken(event.params.token).id;
    claimEvent.amount = event.params.amount;
    claimEvent.save();
}

export function handleRecover(event: Recover): void {
    let reward = getRewardOrThrow(event.address, event.params.token);
    reward.unclaimed = reward.unclaimed.minus(event.params.amount);
    reward.save();

    let campaign = getCampaignOrThrow(event.address);

    let recoverEvent = new RecoverEvent(getEventId(event));
    recoverEvent.transaction = getOrCreateTransaction(event).id;
    recoverEvent.campaign = campaign.id;
    recoverEvent.receiver = event.params.receiver;
    recoverEvent.token = getOrCreateToken(event.params.token).id;
    recoverEvent.amount = event.params.amount;
    recoverEvent.save();
}

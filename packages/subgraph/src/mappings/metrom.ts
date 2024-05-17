import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    Initialize,
    CreateCampaign,
    DistributeReward,
    ClaimReward,
    ClaimFee,
    TransferOwnership,
    AcceptOwnership,
    SetUpdater,
    SetGlobalFee,
    SetMinimumCampaignDuration,
    SetMaximumCampaignDuration,
    SetSpecificFee,
    RecoverReward,
    TransferCampaignOwnership,
    AcceptCampaignOwnership,
    Ossify,
} from "../../generated/Metrom/Metrom";
import {
    AcceptOwnershipEvent,
    Campaign,
    ClaimRewardEvent,
    ClaimFeeEvent,
    CreateCampaignEvent,
    DistributeRewardEvent,
    InitializeEvent,
    Metrom,
    Reward,
    SetGlobalFeeEvent,
    SetSpecificFeeEvent,
    SetMinimumCampaignDurationEvent,
    SetMaximumCampaignDurationEvent,
    SetUpdaterEvent,
    TransferOwnershipEvent,
    RecoverRewardEvent,
    TransferCampaignOwnershipEvent,
    AcceptCampaignOwnershipEvent,
    OssifyEvent,
} from "../../generated/schema";
import { METROM_ADDRESS } from "../addresses";
import {
    getClaimableFeeOrThrow,
    getCampaignOrThrow,
    getEventId,
    getMetromOrThrow,
    getOrCreateClaimableFee,
    getOrCreateToken,
    getOrCreateTransaction,
    getRewardId,
    getRewardOrThrow,
    getOrCreateSpecificFee,
    getOrCreateClaimedByAccount,
    getOrCreateRecoveredByAccount,
} from "../commons";

export function handleInitialize(event: Initialize): void {
    // safety check
    if (METROM_ADDRESS != event.address)
        throw new Error(
            `Inconsistent Metrom address: expected ${METROM_ADDRESS.toHex()}, got ${event.address.toHex()}`,
        );

    let transaction = getOrCreateTransaction(event);
    let initializeEvent = new InitializeEvent(getEventId(event));
    initializeEvent.transaction = transaction.id;
    initializeEvent.metrom = METROM_ADDRESS;
    initializeEvent.owner = event.params.owner;
    initializeEvent.updater = event.params.updater;
    initializeEvent.globalFee = event.params.globalFee;
    initializeEvent.minimumCampaignDuration =
        event.params.minimumCampaignDuration;
    initializeEvent.maximumCampaignDuration =
        event.params.minimumCampaignDuration;
    initializeEvent.save();

    let metrom = new Metrom(METROM_ADDRESS);
    metrom.transaction = transaction.id;
    metrom.ossified = false;
    metrom.owner = event.params.owner;
    metrom.pendingOwner = Address.zero();
    metrom.updater = event.params.updater;
    metrom.globalFee = event.params.globalFee;
    metrom.minimumCampaignDuration = event.params.minimumCampaignDuration;
    metrom.maximumCampaignDuration = event.params.maximumCampaignDuration;
    metrom.campaignsAmount = BigInt.zero();
    metrom.save();
}

export function handleCreateCampaign(event: CreateCampaign): void {
    let metrom = getMetromOrThrow();
    metrom.campaignsAmount = metrom.campaignsAmount.plus(BigInt.fromI32(1));
    metrom.save();

    let transaction = getOrCreateTransaction(event);

    let campaign = new Campaign(event.params.id);
    campaign.transaction = transaction.id;
    campaign.metrom = metrom.id;
    campaign.creationBlockNumber = event.block.number;
    campaign.creationTimestamp = event.block.timestamp;
    campaign.owner = event.params.owner;
    campaign.pendingOwner = Address.zero();
    campaign.chainId = event.params.chainId;
    campaign.pool = event.params.pool;
    campaign.from = event.params.from;
    campaign.to = event.params.to;
    campaign.specification = event.params.specification;
    campaign.root = Bytes.empty();
    campaign.data = Bytes.empty();
    campaign.save();

    let rewardTokensBytes: Bytes[] = [];
    for (let i = 0; i < event.params.rewardTokens.length; i++) {
        let rewardToken = getOrCreateToken(event.params.rewardTokens[i]);
        let rewardAmount = event.params.rewardAmounts[i];

        let reward = new Reward(getRewardId(campaign.id, rewardToken.id));
        reward.campaign = campaign.id;
        reward.token = rewardToken.id;
        reward.amount = rewardAmount;
        reward.unclaimed = rewardAmount;
        reward.recovered = BigInt.zero();
        reward.save();

        let claimableFee = getOrCreateClaimableFee(rewardToken);
        claimableFee.amount = claimableFee.amount.plus(
            event.params.feeAmounts[i],
        );
        claimableFee.save();

        rewardTokensBytes.push(rewardToken.id);
    }

    let createCampaignEvent = new CreateCampaignEvent(getEventId(event));
    createCampaignEvent.transaction = transaction.id;
    createCampaignEvent.metrom = METROM_ADDRESS;
    createCampaignEvent.campaign = event.params.id;
    createCampaignEvent.owner = event.params.owner;
    createCampaignEvent.chainId = event.params.chainId;
    createCampaignEvent.owner = event.params.owner;
    createCampaignEvent.pool = event.params.pool;
    createCampaignEvent.from = event.params.from;
    createCampaignEvent.to = event.params.to;
    createCampaignEvent.specification = event.params.specification;
    createCampaignEvent.rewardTokens = rewardTokensBytes;
    createCampaignEvent.rewardAmounts = event.params.rewardAmounts;
    createCampaignEvent.feeAmounts = event.params.feeAmounts;
    createCampaignEvent.save();
}

export function handleDistributeReward(event: DistributeReward): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);
    campaign.root = event.params.root;
    campaign.data = event.params.data;
    campaign.save();

    let distributeRewardEvent = new DistributeRewardEvent(getEventId(event));
    distributeRewardEvent.transaction = getOrCreateTransaction(event).id;
    distributeRewardEvent.metrom = METROM_ADDRESS;
    distributeRewardEvent.campaign = campaign.id;
    distributeRewardEvent.root = event.params.root;
    distributeRewardEvent.data = event.params.data;
    distributeRewardEvent.save();
}

export function handleClaimReward(event: ClaimReward): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);
    let reward = getRewardOrThrow(campaign.id, event.params.token);
    let claimedByAccount = getOrCreateClaimedByAccount(
        campaign.id,
        reward.id,
        event.transaction.from,
    );

    reward.unclaimed = reward.unclaimed.minus(event.params.amount);
    reward.save();

    claimedByAccount.amount = claimedByAccount.amount.plus(event.params.amount);
    claimedByAccount.save();

    let claimRewardEvent = new ClaimRewardEvent(getEventId(event));
    claimRewardEvent.transaction = getOrCreateTransaction(event).id;
    claimRewardEvent.metrom = METROM_ADDRESS;
    claimRewardEvent.campaign = campaign.id;
    claimRewardEvent.token = event.params.token;
    claimRewardEvent.amount = event.params.amount;
    claimRewardEvent.receiver = event.params.receiver;
    claimRewardEvent.save();
}

export function handleRecoverReward(event: RecoverReward): void {
    let campaign = getCampaignOrThrow(event.params.campaignId);
    let reward = getRewardOrThrow(campaign.id, event.params.token);
    let recoveredByAccount = getOrCreateRecoveredByAccount(
        campaign.id,
        reward.id,
        event.transaction.from,
    );

    reward.unclaimed = reward.unclaimed.minus(event.params.amount);
    reward.recovered = reward.recovered.plus(event.params.amount);
    reward.save();

    recoveredByAccount.amount = recoveredByAccount.amount.plus(
        event.params.amount,
    );
    recoveredByAccount.save();

    let recoverRewardEvent = new RecoverRewardEvent(getEventId(event));
    recoverRewardEvent.transaction = getOrCreateTransaction(event).id;
    recoverRewardEvent.metrom = METROM_ADDRESS;
    recoverRewardEvent.campaign = campaign.id;
    recoverRewardEvent.token = event.params.token;
    recoverRewardEvent.amount = event.params.amount;
    recoverRewardEvent.receiver = event.params.receiver;
    recoverRewardEvent.save();
}

export function handleClaimFee(event: ClaimFee): void {
    let feeToken = getOrCreateToken(event.params.token);
    let claimableFee = getClaimableFeeOrThrow(feeToken);
    claimableFee.amount = BigInt.zero();
    claimableFee.save();

    let claimFeeEvent = new ClaimFeeEvent(getEventId(event));
    claimFeeEvent.transaction = getOrCreateTransaction(event).id;
    claimFeeEvent.metrom = METROM_ADDRESS;
    claimFeeEvent.token = event.params.token;
    claimFeeEvent.amount = event.params.amount;
    claimFeeEvent.receiver = event.params.receiver;
    claimFeeEvent.save();
}

export function handleTransferCampaignOwnership(
    event: TransferCampaignOwnership,
): void {
    let campaign = getCampaignOrThrow(event.params.id);
    campaign.pendingOwner = event.params.owner;
    campaign.save();

    let transferCampaignOwnershipEvent = new TransferCampaignOwnershipEvent(
        getEventId(event),
    );
    transferCampaignOwnershipEvent.transaction =
        getOrCreateTransaction(event).id;
    transferCampaignOwnershipEvent.metrom = METROM_ADDRESS;
    transferCampaignOwnershipEvent.campaign = campaign.id;
    transferCampaignOwnershipEvent.owner = event.params.owner;
    transferCampaignOwnershipEvent.save();
}

export function handleAcceptCampaignOwnership(
    event: AcceptCampaignOwnership,
): void {
    let campaign = getCampaignOrThrow(event.params.id);
    campaign.owner = campaign.pendingOwner;
    campaign.pendingOwner = Address.zero();
    campaign.save();

    let acceptCampaignOwnershipEvent = new AcceptCampaignOwnershipEvent(
        getEventId(event),
    );
    acceptCampaignOwnershipEvent.transaction = getOrCreateTransaction(event).id;
    acceptCampaignOwnershipEvent.metrom = METROM_ADDRESS;
    acceptCampaignOwnershipEvent.campaign = campaign.id;
    acceptCampaignOwnershipEvent.owner = campaign.owner;
    acceptCampaignOwnershipEvent.save();
}

export function handleTransferOwnership(event: TransferOwnership): void {
    let metrom = getMetromOrThrow();
    metrom.pendingOwner = event.params.owner;
    metrom.save();

    let transferOwnershipEvent = new TransferOwnershipEvent(getEventId(event));
    transferOwnershipEvent.transaction = getOrCreateTransaction(event).id;
    transferOwnershipEvent.metrom = metrom.id;
    transferOwnershipEvent.owner = event.params.owner;
    transferOwnershipEvent.save();
}

export function handleAcceptOwnership(event: AcceptOwnership): void {
    let metrom = getMetromOrThrow();
    metrom.owner = metrom.pendingOwner;
    metrom.pendingOwner = Address.zero();
    metrom.save();

    let acceptOwnershipEvent = new AcceptOwnershipEvent(getEventId(event));
    acceptOwnershipEvent.transaction = getOrCreateTransaction(event).id;
    acceptOwnershipEvent.metrom = metrom.id;
    acceptOwnershipEvent.owner = metrom.owner;
    acceptOwnershipEvent.save();
}

export function handleSetUpdater(event: SetUpdater): void {
    let metrom = getMetromOrThrow();
    metrom.updater = event.params.updater;
    metrom.save();

    let setUpdaterEvent = new SetUpdaterEvent(getEventId(event));
    setUpdaterEvent.transaction = getOrCreateTransaction(event).id;
    setUpdaterEvent.metrom = metrom.id;
    setUpdaterEvent.updater = event.params.updater;
    setUpdaterEvent.save();
}

export function handleSetGlobalFee(event: SetGlobalFee): void {
    let metrom = getMetromOrThrow();
    metrom.globalFee = event.params.globalFee;
    metrom.save();

    let setGlobalFeeEvent = new SetGlobalFeeEvent(getEventId(event));
    setGlobalFeeEvent.transaction = getOrCreateTransaction(event).id;
    setGlobalFeeEvent.metrom = metrom.id;
    setGlobalFeeEvent.globalFee = event.params.globalFee;
    setGlobalFeeEvent.save();
}

export function handleSetSpecificFee(event: SetSpecificFee): void {
    let specificFee = getOrCreateSpecificFee(event.params.account);
    specificFee.fee = event.params.specificFee;
    specificFee.none = event.params.specificFee == BigInt.zero();
    specificFee.save();

    let setSpecificFeeEvent = new SetSpecificFeeEvent(getEventId(event));
    setSpecificFeeEvent.transaction = getOrCreateTransaction(event).id;
    setSpecificFeeEvent.metrom = METROM_ADDRESS;
    setSpecificFeeEvent.address = event.params.account;
    setSpecificFeeEvent.specificFee = event.params.specificFee;
    setSpecificFeeEvent.save();
}

export function handleSetMinimumCampaignDuration(
    event: SetMinimumCampaignDuration,
): void {
    let metrom = getMetromOrThrow();
    metrom.minimumCampaignDuration = event.params.minimumCampaignDuration;
    metrom.save();

    let setMinimumCampaignDuration = new SetMinimumCampaignDurationEvent(
        getEventId(event),
    );
    setMinimumCampaignDuration.transaction = getOrCreateTransaction(event).id;
    setMinimumCampaignDuration.metrom = metrom.id;
    setMinimumCampaignDuration.minimumCampaignDuration =
        event.params.minimumCampaignDuration;
    setMinimumCampaignDuration.save();
}

export function handleSetMaximumCampaignDuration(
    event: SetMaximumCampaignDuration,
): void {
    let metrom = getMetromOrThrow();
    metrom.maximumCampaignDuration = event.params.maximumCampaignDuration;
    metrom.save();

    let setMaximumCampaignDuration = new SetMaximumCampaignDurationEvent(
        getEventId(event),
    );
    setMaximumCampaignDuration.transaction = getOrCreateTransaction(event).id;
    setMaximumCampaignDuration.metrom = metrom.id;
    setMaximumCampaignDuration.maximumCampaignDuration =
        event.params.maximumCampaignDuration;
    setMaximumCampaignDuration.save();
}

export function handleOssify(event: Ossify): void {
    let metrom = getMetromOrThrow();
    metrom.ossified = true;
    metrom.save();

    let ossify = new OssifyEvent(getEventId(event));
    ossify.transaction = getOrCreateTransaction(event).id;
    ossify.metrom = metrom.id;
    ossify.save();
}

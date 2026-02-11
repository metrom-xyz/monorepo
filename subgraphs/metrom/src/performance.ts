import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
    RewardsCampaign,
    CampaignSnapshot,
    CampaignParticipant,
    CampaignDailyMetrics,
} from "../generated/schema";
import {
    getSnapshotId,
    getOrCreateParticipant,
    getOrCreateDailyMetrics,
    SNAPSHOT_INTERVAL,
    BI_0,
    BI_1,
} from "./commons";

export function updateParticipantMetrics(
    campaignId: Bytes,
    participantAddress: Bytes,
    claimAmount: BigInt,
    timestamp: BigInt
): void {
    let participant = getOrCreateParticipant(
        campaignId,
        participantAddress,
        timestamp
    );

    let isNewParticipant = participant.claimCount.equals(BI_0);

    participant.lastClaimTimestamp = timestamp;
    participant.totalClaimed = participant.totalClaimed.plus(claimAmount);
    participant.claimCount = participant.claimCount.plus(BI_1);
    participant.save();

    // Update daily metrics
    updateDailyMetrics(
        campaignId,
        timestamp,
        claimAmount,
        isNewParticipant,
        false // not first claim for this participant today (simplified)
    );
}

export function updateDailyMetrics(
    campaignId: Bytes,
    timestamp: BigInt,
    claimAmount: BigInt,
    isNewParticipant: boolean,
    isFirstClaimToday: boolean
): void {
    let metrics = getOrCreateDailyMetrics(campaignId, timestamp);

    metrics.claimsToday = metrics.claimsToday.plus(BI_1);
    metrics.claimedToday = metrics.claimedToday.plus(claimAmount);

    if (isFirstClaimToday) {
        metrics.uniqueClaimersToday = metrics.uniqueClaimersToday.plus(BI_1);
    }

    if (isNewParticipant) {
        metrics.newParticipants = metrics.newParticipants.plus(BI_1);
    }

    metrics.totalClaimsToDate = metrics.totalClaimsToDate.plus(BI_1);
    metrics.totalClaimedToDate = metrics.totalClaimedToDate.plus(claimAmount);

    metrics.save();
}

export function shouldTakeSnapshot(timestamp: BigInt): boolean {
    let currentInterval = timestamp.div(SNAPSHOT_INTERVAL);
    let previousSecond = timestamp.minus(BigInt.fromI32(1));
    let previousInterval = previousSecond.div(SNAPSHOT_INTERVAL);

    return !currentInterval.equals(previousInterval);
}

export function takeCampaignSnapshot(
    campaign: RewardsCampaign,
    timestamp: BigInt,
    blockNumber: BigInt
): void {
    let snapshotId = getSnapshotId(campaign.id, timestamp);

    // Check if snapshot already exists
    let existing = CampaignSnapshot.load(snapshotId);
    if (existing !== null) {
        log.debug("Snapshot already exists for campaign {} at timestamp {}", [
            campaign.id.toHex(),
            timestamp.toString(),
        ]);
        return;
    }

    // Calculate metrics
    let totalRewardsDistributed = BI_0;
    let totalClaimed = BI_0;
    let totalRecovered = BI_0;

    let rewards = campaign.rewards.load();
    for (let i = 0; i < rewards.length; i++) {
        let reward = rewards[i];
        totalRewardsDistributed = totalRewardsDistributed.plus(reward.amount);
        totalClaimed = totalClaimed.plus(reward.claimed);
        totalRecovered = totalRecovered.plus(reward.recovered);
    }

    // Count unique participants
    let participants = campaign.participants.load();
    let uniqueClaimers = BigInt.fromI32(participants.length);

    // Create snapshot
    let snapshot = new CampaignSnapshot(snapshotId);
    snapshot.campaign = campaign.id;
    snapshot.timestamp = timestamp
        .div(SNAPSHOT_INTERVAL)
        .times(SNAPSHOT_INTERVAL);
    snapshot.blockNumber = blockNumber;
    snapshot.totalRewardsDistributed = totalRewardsDistributed;
    snapshot.totalClaimed = totalClaimed;
    snapshot.totalRecovered = totalRecovered;
    snapshot.uniqueClaimers = uniqueClaimers;
    snapshot.claimCount = BI_0; // Would need to track this separately
    snapshot.activeParticipants = uniqueClaimers;
    snapshot.save();

    log.info("Created snapshot for campaign {} at timestamp {}", [
        campaign.id.toHex(),
        timestamp.toString(),
    ]);
}

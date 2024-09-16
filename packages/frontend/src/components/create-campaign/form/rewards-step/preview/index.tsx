import { type Token, type WhitelistedErc20TokenAmount } from "@metrom-xyz/sdk";
import type { CampaignPayload } from "@/src/types";
import { Reward, RewardSkeleton } from "./reward";
import type { Address } from "viem";

import styles from "./styles.module.css";

interface RewardsPreviewProps {
    rewards?: CampaignPayload["rewards"];
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
    onError: (address: Address, error?: string) => void;
    onUpdate: (updatedReward: WhitelistedErc20TokenAmount) => void;
}

export function RewardsPreview({
    rewards,
    campaignDuration,
    onRemove,
    onError,
    onUpdate,
}: RewardsPreviewProps) {
    if (!rewards || rewards.length === 0) return <RewardSkeleton />;

    return (
        <div className={styles.root}>
            {rewards?.map((reward) => (
                <Reward
                    key={reward.token.address}
                    reward={reward}
                    campaignDuration={campaignDuration}
                    onRemove={onRemove}
                    onUpdate={onUpdate}
                    onError={onError}
                />
            ))}
        </div>
    );
}

import { type Token } from "@metrom-xyz/sdk";
import type { CampaignPayload } from "@/src/types";
import { Reward } from "./reward";

import styles from "./styles.module.css";

interface RewardsPreviewProps {
    rewards?: CampaignPayload["rewards"];
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
}

export function RewardsPreview({
    rewards,
    campaignDuration,
    onRemove,
}: RewardsPreviewProps) {
    if (!rewards || rewards.length === 0) return;

    return (
        <div className={styles.root}>
            {rewards?.map((reward) => (
                <Reward
                    key={reward.token.address}
                    reward={reward}
                    campaignDuration={campaignDuration}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}

import { type Token } from "@metrom-xyz/sdk";
import type { CampaignPayload } from "@/src/types";
import { Reward } from "./reward";
import type { Address } from "viem";

import styles from "./styles.module.css";

interface RewardsPreviewProps {
    rewards?: CampaignPayload["rewards"];
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
    onError: (address: Address, error?: string) => void;
}

export function RewardsPreview({
    rewards,
    campaignDuration,
    onRemove,
    onError,
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
                    onError={onError}
                />
            ))}
        </div>
    );
}

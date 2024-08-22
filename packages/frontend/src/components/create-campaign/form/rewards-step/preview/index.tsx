import { type Token } from "@metrom-xyz/sdk";
import type { CampaignPayload } from "@/src/types";
import { Reward } from "./reward";
import type { Address } from "viem";
import { useTransition, animated } from "@react-spring/web";

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
    const transitions = useTransition(rewards || [], {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 100 },
    });

    if (!rewards || rewards.length === 0) return;

    return (
        <div className={styles.root}>
            {transitions((style, reward) => (
                <animated.div style={style}>
                    <Reward
                        key={reward.token.address}
                        reward={reward}
                        campaignDuration={campaignDuration}
                        onRemove={onRemove}
                        onError={onError}
                    />
                </animated.div>
            ))}
        </div>
    );
}

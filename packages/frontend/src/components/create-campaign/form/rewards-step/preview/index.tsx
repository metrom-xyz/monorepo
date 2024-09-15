import { type Token, type WhitelistedErc20TokenAmount } from "@metrom-xyz/sdk";
import type { CampaignPayload } from "@/src/types";
import { Reward, RewardSkeleton } from "./reward";
import type { Address } from "viem";
import { useTransition, animated } from "@react-spring/web";

import styles from "./styles.module.css";

interface RewardsPreviewProps {
    rewards?: CampaignPayload["rewards"];
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
    onError: (address: Address, error?: string) => void;
    onUpdate: (
        oldReward: WhitelistedErc20TokenAmount,
        newReward: WhitelistedErc20TokenAmount,
    ) => void;
}

export function RewardsPreview({
    rewards,
    campaignDuration,
    onRemove,
    onError,
    onUpdate,
}: RewardsPreviewProps) {
    const transitions = useTransition(rewards || [], {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 100 },
    });

    if (!rewards || rewards.length === 0) return <RewardSkeleton />;

    return (
        <div className={styles.root}>
            {transitions((style, reward) => (
                <animated.div style={style}>
                    <Reward
                        key={reward.token.address}
                        reward={reward}
                        campaignDuration={campaignDuration}
                        onRemove={onRemove}
                        onUpdate={onUpdate}
                        onError={onError}
                        rewards={rewards}
                    />
                </animated.div>
            ))}
        </div>
    );
}

import { type Token, type WhitelistedErc20TokenAmount } from "@metrom-xyz/sdk";
import type { CampaignPayload } from "@/src/types";
import { Reward } from "./reward";
import type { Address } from "viem";

import styles from "./styles.module.css";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("newCampaign.form.rewards");

    if (!rewards || rewards.length === 0)
        return (
            <div className={styles.rewardSkeleton}>
                <Typography
                    className={styles.rewardSkeletonText}
                    weight="medium"
                    variant="xs"
                    uppercase
                >
                    {t("rewardsPreviewList.empty")}
                </Typography>
            </div>
        );

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

import { type Erc20Token } from "@metrom-xyz/sdk";
import type {
    BaseCampaignPayload,
    WhitelistedErc20TokenAmount,
} from "@/src/types/common";
import { Reward } from "./reward";
import type { Address } from "viem";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface RewardsPreviewProps {
    rewards?: BaseCampaignPayload["tokens"];
    campaignDuration?: number;
    onRemove: (reward: Erc20Token) => void;
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
    const t = useTranslations("newCampaign.form.base.rewards.tokens");

    if (!rewards || rewards.length === 0)
        return (
            <div className={styles.rewardSkeleton}>
                <Typography
                    weight="medium"
                    size="xs"
                    uppercase
                    className={styles.rewardSkeletonText}
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

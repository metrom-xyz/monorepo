import { type Erc20Token } from "@metrom-xyz/sdk";
import type { WhitelistedErc20TokenAmount } from "@/src/types/common";
import type { CampaignPayloadTokenDistributables } from "@/src/types/campaign";
import { Reward } from "./reward";
import type { Address } from "viem";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { TokensErrorMessage } from "..";

import styles from "./styles.module.css";

interface RewardsPreviewProps {
    distributables?: CampaignPayloadTokenDistributables;
    campaignDuration?: number;
    onRemove: (reward: Erc20Token) => void;
    onError: (address: Address, error?: TokensErrorMessage) => void;
    onUpdate: (updatedReward: WhitelistedErc20TokenAmount) => void;
}

export function RewardsPreview({
    distributables,
    campaignDuration,
    onRemove,
    onError,
    onUpdate,
}: RewardsPreviewProps) {
    const t = useTranslations("newCampaign.form.base.rewards.tokens");

    if (
        !distributables ||
        !distributables.tokens ||
        distributables.tokens.length === 0
    )
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
            {distributables.tokens.map((reward) => (
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

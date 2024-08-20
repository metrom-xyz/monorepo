import { Typography } from "@/src/ui/typography";
import { formatUnits } from "viem";
import numeral from "numeral";
import {
    type SupportedChain,
    type Token,
    type TokenAmount,
} from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { XIcon } from "@/src/assets/x-icon";

import styles from "./styles.module.css";
import { useCallback } from "react";

interface RewardsPreviewProps {
    chain: SupportedChain;
    rewards?: TokenAmount[];
    onRemove: (reward: Token) => void;
}

export function RewardsPreview({
    chain,
    rewards,
    onRemove,
}: RewardsPreviewProps) {
    const getRewardOnRemoveHandler = useCallback(
        (reward: Token) => () => onRemove(reward),
        [onRemove],
    );

    if (!rewards || rewards.length === 0) return;

    return (
        <div className={styles.root}>
            {rewards?.map((reward) => (
                <div key={reward.token.address} className={styles.reward}>
                    <Typography
                        variant="lg"
                        weight="medium"
                        className={{ root: styles.rewardAmount }}
                    >
                        {numeral(
                            formatUnits(reward.amount, reward.token.decimals),
                        ).format("(0.00 a)")}
                    </Typography>
                    <Typography weight="medium" light>
                        $ 0
                    </Typography>
                    <div className={styles.rewardName}>
                        <RemoteLogo
                            size="sm"
                            address={reward.token.address}
                            chain={chain}
                        />
                        <Typography variant="lg" weight="medium">
                            {reward.token.symbol}
                        </Typography>
                    </div>
                    <div
                        className={styles.removeIconWrapper}
                        onClick={getRewardOnRemoveHandler(reward.token)}
                    >
                        <XIcon className={styles.removeIcon} />
                    </div>
                </div>
            ))}
        </div>
    );
}

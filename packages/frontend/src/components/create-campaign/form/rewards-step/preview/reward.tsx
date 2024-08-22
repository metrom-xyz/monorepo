import { XIcon } from "@/src/assets/x-icon";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { Typography } from "@/src/ui/typography";
import type { Token, WhitelistedErc20TokenAmount } from "@metrom-xyz/sdk";
import numeral from "numeral";
import { useCallback, useEffect } from "react";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { useAccount, useChainId } from "wagmi";
import { formatUnits } from "viem/utils";

import styles from "./styles.module.css";

interface RewardProps {
    reward: WhitelistedErc20TokenAmount;
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
}

export function Reward({ reward, campaignDuration, onRemove }: RewardProps) {
    const { address } = useAccount();
    const chain = useChainId();
    const { balance: rewardTokenBalance } = useWatchBalance(
        address,
        reward.token.address,
    );

    useEffect(() => {
        if (
            !reward.amount ||
            rewardTokenBalance === undefined ||
            !campaignDuration ||
            !reward
        )
            return;

        const distributionRate = (reward.amount * 3_600) / campaignDuration;
        const balance = Number(
            formatUnits(rewardTokenBalance, reward.token.decimals),
        );
        const minimumRate = Number(
            formatUnits(reward.minimumRate, reward.token.decimals),
        );

        const error =
            reward.amount > balance
                ? "errors.insufficientBalance"
                : distributionRate < minimumRate
                  ? "errors.lowDistributionRate"
                  : "";

        // TODO: implement error
        // onError(reward.token.address, error);
    }, [campaignDuration, reward, rewardTokenBalance]);

    const getRewardOnRemoveHandler = useCallback(
        (reward: Token) => () => {
            // onError(reward.address, "");
            onRemove(reward);
        },
        [onRemove],
    );

    return (
        <div key={reward.token.address} className={styles.reward}>
            <Typography
                variant="lg"
                weight="medium"
                className={{ root: styles.rewardAmount }}
            >
                {numeral(reward.amount).format("(0.00[00] a)")}
            </Typography>
            <Typography weight="medium" light>
                {/* TODO: usd amount */}$ 0
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
    );
}

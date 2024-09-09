import { XIcon } from "@/src/assets/x-icon";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { Typography } from "@/src/ui/typography";
import type { Token, WhitelistedErc20TokenAmount } from "@metrom-xyz/sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { useAccount, useChainId } from "wagmi";
import { formatUnits } from "viem/utils";
import type { Address } from "viem";
import classNames from "@/src/utils/classes";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface RewardProps {
    reward: WhitelistedErc20TokenAmount;
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
    onError: (address: Address, error?: string) => void;
}

export function Reward({
    reward,
    campaignDuration,
    onRemove,
    onError,
}: RewardProps) {
    const [error, setError] = useState(false);

    const { address } = useAccount();
    const chain = useChainId();
    const { balance: rewardTokenBalance } = useWatchBalance(
        address,
        reward.token.address,
    );

    const tokenUsdValue = useMemo(() => {
        if (!reward.usdPrice) return null;
        return reward.amount * reward.usdPrice;
    }, [reward.amount, reward.usdPrice]);

    useEffect(() => {
        if (!reward.amount || !campaignDuration || !reward) return;

        const distributionRate = (reward.amount * 3_600) / campaignDuration;
        const balance =
            rewardTokenBalance !== undefined
                ? Number(formatUnits(rewardTokenBalance, reward.token.decimals))
                : Number.MAX_SAFE_INTEGER;

        const error =
            reward.amount > balance
                ? "newCampaign.form.rewards.errors.insufficientBalance"
                : distributionRate < reward.minimumRate
                  ? "newCampaign.form.rewards.errors.lowDistributionRate"
                  : "";

        onError(reward.token.address, error);
        setError(!!error);
    }, [campaignDuration, onError, reward, rewardTokenBalance]);

    const getRewardOnRemoveHandler = useCallback(
        (reward: Token) => () => {
            onError(reward.address, "");
            onRemove(reward);
        },
        [onError, onRemove],
    );

    return (
        <div
            key={reward.token.address}
            className={classNames(styles.reward, { [styles.error]: error })}
        >
            <Typography
                variant="lg"
                weight="medium"
                className={styles.rewardAmount}
            >
                {formatTokenAmount(reward.amount)}
            </Typography>
            <Typography weight="medium" light variant="sm">
                {tokenUsdValue ? formatUsdAmount(tokenUsdValue) : "-"}
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

import { XIcon } from "@/src/assets/x-icon";
import {
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import type {
    Token,
    WhitelistedErc20Token,
    WhitelistedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { useAccount, useChainId } from "wagmi";
import { formatUnits } from "viem/utils";
import type { Address } from "viem";
import classNames from "classnames";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ChevronDown } from "@/src/assets/chevron-down";
import { RewardTokensList } from "../reward-tokens-list";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface RewardProps {
    rewards: WhitelistedErc20TokenAmount[];
    reward: WhitelistedErc20TokenAmount;
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
    onError: (address: Address, error?: string) => void;
    onUpdate: (
        oldReward: WhitelistedErc20TokenAmount,
        newReward: WhitelistedErc20TokenAmount,
    ) => void;
}

export function Reward({
    reward,
    campaignDuration,
    onRemove,
    onError,
    onUpdate,
    rewards,
}: RewardProps) {
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const [rewardAmount, setRewardAmount] = useState<number | undefined>(
        reward.amount,
    );
    const [rewardToken, setRewardToken] = useState<WhitelistedErc20Token>({
        ...reward.token,
        usdPrice: reward.usdPrice,
        minimumRate: reward.minimumRate,
    });
    const { address } = useAccount();
    const chain = useChainId();
    const { balance: rewardTokenBalance } = useWatchBalance(
        address,
        rewardToken.address,
    );

    const tokenUsdValue = useMemo(() => {
        if (!rewardToken.usdPrice || !rewardAmount) return null;
        return rewardAmount * rewardToken.usdPrice;
    }, [rewardAmount, rewardToken.usdPrice]);

    useEffect(() => {
        if (!rewardAmount || !campaignDuration || !reward) return;

        const distributionRate = (rewardAmount * 3_600) / campaignDuration;
        const balance =
            rewardTokenBalance !== undefined
                ? Number(formatUnits(rewardTokenBalance, rewardToken.decimals))
                : Number.MAX_SAFE_INTEGER;

        const error =
            rewardAmount > balance
                ? "newCampaign.form.rewards.errors.insufficientBalance"
                : distributionRate < rewardToken.minimumRate
                  ? "newCampaign.form.rewards.errors.lowDistributionRate"
                  : "";

        onError(rewardToken.address, error);
        setError(!!error);
    }, [
        campaignDuration,
        onError,
        reward,
        rewardAmount,
        rewardToken.address,
        rewardToken.decimals,
        rewardToken.minimumRate,
        rewardTokenBalance,
    ]);

    const getRewardOnRemoveHandler = useCallback(
        (reward: Token) => () => {
            onError(rewardToken.address, "");
            onRemove(reward);
        },
        [onError, onRemove, rewardToken.address],
    );
    const handleRewardAmountOnBlur = useCallback(() => {
        const { address, decimals, name, symbol, minimumRate, usdPrice } =
            rewardToken;
        const newReward: WhitelistedErc20TokenAmount = {
            token: { address, decimals, name, symbol },
            amount: rewardAmount ?? 0,
            usdPrice,
            minimumRate,
        };
        onUpdate(reward, newReward);
    }, [onUpdate, reward, rewardAmount, rewardToken]);

    const handleRewardTokenOnChange = useCallback(
        (newToken: WhitelistedErc20Token) => {
            const { address, decimals, name, symbol, minimumRate, usdPrice } =
                newToken;
            const newReward: WhitelistedErc20TokenAmount = {
                token: { address, decimals, name, symbol },
                amount: rewardAmount ?? 0,
                usdPrice,
                minimumRate,
            };
            setOpen(false);
            setRewardToken(newToken);
            onError(reward.token.address, "");
            onUpdate(reward, newReward);
        },
        [onError, onUpdate, reward, rewardAmount],
    );

    const handleRewardAmountOnChange = useCallback(
        (rawNewAmount: NumberFormatValues) => {
            setRewardAmount(rawNewAmount.floatValue);
        },
        [],
    );

    function handleRewardTokenButtonOnClick() {
        setOpen((open) => !open);
    }

    return (
        <div
            key={rewardToken.address}
            className={classNames(styles.reward, { [styles.error]: error })}
        >
            <div className={styles.rewardPreviewWrapper}>
                <div>
                    <NumberInput
                        placeholder="0"
                        value={rewardAmount ? rewardAmount.toString() : ""}
                        onValueChange={handleRewardAmountOnChange}
                        className={styles.rewardTokenAmountInput}
                        onBlur={handleRewardAmountOnBlur}
                    />
                    <Typography weight="medium" light variant="xs">
                        {tokenUsdValue ? formatUsdAmount(tokenUsdValue) : "-"}
                    </Typography>
                </div>
                <div className={styles.rewardTokenWrapper}>
                    <div
                        className={styles.rewardToken}
                        onClick={handleRewardTokenButtonOnClick}
                    >
                        <RemoteLogo
                            size="xs"
                            address={rewardToken.address}
                            chain={chain}
                        />
                        <Typography weight="medium">
                            {rewardToken.symbol}
                        </Typography>
                        <ChevronDown className={styles.chevronDown} />
                    </div>
                    <div
                        className={styles.removeIconWrapper}
                        onClick={getRewardOnRemoveHandler(rewardToken)}
                    >
                        <XIcon className={styles.removeIcon} />
                    </div>
                </div>
            </div>
            <RewardTokensList
                unavailable={rewards}
                value={rewardToken}
                onRewardTokenClick={handleRewardTokenOnChange}
                isOpen={open}
            />
        </div>
    );
}

export function RewardSkeleton() {
    const t = useTranslations();
    return (
        <div className={styles.rewardSkeleton}>
            <Typography
                className={styles.rewardSkeletonText}
                weight="medium"
                variant="xs"
                uppercase
            >
                {t("newCampaign.form.rewards.rewardsPreviewList.empty")}
            </Typography>
        </div>
    );
}

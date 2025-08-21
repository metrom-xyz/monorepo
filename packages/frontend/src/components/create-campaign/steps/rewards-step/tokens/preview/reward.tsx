import { XIcon } from "@/src/assets/x-icon";
import {
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import type { Erc20Token, UsdPricedOnChainAmount } from "@metrom-xyz/sdk";
import { useCallback, useEffect, useState } from "react";
import { useWatchBalance } from "@/src/hooks/use-watch-balance";
import { useChainId } from "wagmi";
import { useAccount } from "@/src/hooks/use-account";
import { parseUnits } from "viem/utils";
import type { Address } from "viem";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { MAX_U256 } from "@/src/commons";
import type { WhitelistedErc20TokenAmount } from "@/src/types/common";
import type { TokensErrorMessage } from "..";

import styles from "./styles.module.css";

interface RewardProps {
    reward: WhitelistedErc20TokenAmount;
    campaignDuration?: number;
    onRemove: (reward: Erc20Token) => void;
    onError: (address: Address, error?: TokensErrorMessage) => void;
    onUpdate: (updatedReward: WhitelistedErc20TokenAmount) => void;
}

export function Reward({
    reward,
    campaignDuration,
    onRemove,
    onError,
    onUpdate,
}: RewardProps) {
    const [error, setError] = useState(false);
    const [rewardRawValue, setRewardRawValue] = useState<NumberFormatValues>({
        floatValue: reward.amount.formatted,
        formattedValue: reward.amount.formatted.toString(),
        value: reward.amount.formatted.toString(),
    });
    const [rewardAmount, setRewardAmount] = useState<
        UsdPricedOnChainAmount | undefined
    >(reward.amount);
    const { address } = useAccount();
    const chain = useChainId();
    const { balance: rewardTokenBalance } = useWatchBalance({
        address,
        token: reward.token.address,
    });

    useEffect(() => {
        if (!campaignDuration || !reward) return;

        if (!rewardAmount) {
            onError(reward.token.address, "errors.lowDistributionRate");
            setError(true);
            return;
        }

        const distributionRate =
            (rewardAmount.formatted * 3_600) / campaignDuration;
        const balance = rewardTokenBalance || MAX_U256;

        const error =
            rewardAmount.raw > balance
                ? "errors.insufficientBalance"
                : distributionRate < reward.token.minimumRate.formatted
                  ? "errors.lowDistributionRate"
                  : "";

        onError(reward.token.address, error);
        setError(!!error);
    }, [campaignDuration, onError, reward, rewardAmount, rewardTokenBalance]);

    useEffect(() => {
        if (!rewardRawValue) return;

        const formattedNewAmount = rewardRawValue.floatValue;
        if (!formattedNewAmount) setRewardAmount(undefined);
        else {
            const rawNewAmount = parseUnits(
                formattedNewAmount.toString(),
                reward.token.decimals,
            );

            setRewardAmount({
                raw: rawNewAmount,
                formatted: formattedNewAmount,
                usdValue: formattedNewAmount * reward.token.usdPrice,
            });
        }
    }, [reward.token.decimals, reward.token.usdPrice, rewardRawValue]);

    const handleRewardOnRemove = useCallback(() => {
        onError(reward.token.address, "");
        onRemove(reward.token);
    }, [onError, onRemove, reward]);

    const handleRewardAmountOnBlur = useCallback(() => {
        onUpdate({
            ...reward,
            amount: rewardAmount || {
                raw: 0n,
                formatted: 0,
                usdValue: 0,
            },
        });
    }, [onUpdate, reward, rewardAmount]);

    return (
        <div
            key={reward.token.address}
            className={classNames(styles.reward, { [styles.error]: error })}
        >
            <div className={styles.rewardPreviewWrapper}>
                <div>
                    <NumberInput
                        placeholder="0"
                        value={rewardRawValue?.formattedValue}
                        allowNegative={false}
                        onValueChange={setRewardRawValue}
                        onBlur={handleRewardAmountOnBlur}
                        className={styles.rewardTokenAmountInput}
                    />
                    <Typography weight="medium" light size="xs">
                        {reward.amount.usdValue
                            ? formatUsdAmount({
                                  amount: reward.amount.usdValue,
                              })
                            : "-"}
                    </Typography>
                </div>
                <div className={styles.rewardTokenWrapper}>
                    <RemoteLogo
                        size="sm"
                        address={reward.token.address}
                        chain={chain}
                    />
                    <Typography size="lg" weight="medium">
                        {reward.token.symbol}
                    </Typography>
                    <div
                        className={styles.removeIconWrapper}
                        onClick={handleRewardOnRemove}
                    >
                        <XIcon className={styles.removeIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
}

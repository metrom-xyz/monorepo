import { useCallback, useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits, type Address } from "viem";
import {
    Button,
    NumberInput,
    Typography,
    ErrorText,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useAccount, useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import type {
    Erc20Token,
    WhitelistedErc20Token,
    WhitelistedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type {
    CampaignPayload,
    CampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types";
import { RewardTokensList } from "./reward-tokens-list";
import { ChevronDown } from "@/src/assets/chevron-down";
import { RewardsPreview } from "./preview";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { formatUsdAmount } from "@/src/utils/format";
import classNames from "classnames";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { BorderedPlusIcon } from "@/src/assets/bordered-plus-icon";
import { BorderedTickIcon } from "@/src/assets/bordered-tick-icon";

import styles from "./styles.module.css";

interface RewardsStepProps {
    disabled?: boolean;
    rewards?: CampaignPayload["rewards"];
    startDate?: CampaignPayload["startDate"];
    endDate?: CampaignPayload["endDate"];
    onRewardsChange: (rewards: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function RewardsStep({
    disabled,
    rewards,
    startDate,
    endDate,
    onRewardsChange,
    onError,
}: RewardsStepProps) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [rewardAmount, setRewardAmount] = useState<NumberFormatValues>();
    const [rewardToken, setRewardToken] = useState<WhitelistedErc20Token>();
    const [rewardAmountError, setRewardAmountError] = useState("");
    const [existingRewardsErrors, setExistingRewardsErrors] = useState<
        {
            address: Address;
            error?: string;
        }[]
    >([]);
    const [feedbackVisible, setFeedbackVisible] = useState(false);

    const { address } = useAccount();
    const chainId = useChainId();

    const { balance: rewardTokenBalance } = useWatchBalance(
        address,
        rewardToken?.address,
    );

    const totalRewardsUsdAmount = useMemo(() => {
        if (!rewards) return 0;
        let total = 0;
        for (const reward of rewards) {
            if (!reward.amount.usdValue) return 0;
            total += reward.amount.usdValue;
        }
        return total;
    }, [rewards]);

    const campaignDuration = useMemo(() => {
        if (!startDate || !endDate) return undefined;
        return endDate.diff(startDate, "seconds");
    }, [endDate, startDate]);

    const rewardsError = useMemo(() => {
        if (!!rewardAmountError) return rewardAmountError;
        if (!rewards || rewards.length === 0) return "";

        return existingRewardsErrors.length > 0
            ? existingRewardsErrors[0].error
            : "";
    }, [existingRewardsErrors, rewardAmountError, rewards]);

    useEffect(() => {
        onError({ rewards: !!rewardsError });
    }, [onError, rewardsError]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!feedbackVisible) return;

        const timeout = setTimeout(() => {
            setFeedbackVisible(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [feedbackVisible]);

    useEffect(() => {
        if (!campaignDuration || !rewardToken) return;

        if (!rewardAmount || rewardAmount.floatValue === undefined) {
            setRewardAmountError("");
            return;
        }

        const distributionRate =
            (rewardAmount.floatValue * 3_600) / campaignDuration;
        const balance =
            rewardTokenBalance !== undefined
                ? Number(formatUnits(rewardTokenBalance, rewardToken.decimals))
                : Number.MAX_SAFE_INTEGER;

        const error =
            rewardAmount.floatValue > balance
                ? "newCampaign.form.rewards.errors.insufficientBalance"
                : distributionRate < rewardToken.minimumRate.formatted
                  ? "newCampaign.form.rewards.errors.lowDistributionRate"
                  : "";

        setRewardAmountError(error);
    }, [campaignDuration, rewardAmount, rewardToken, rewardTokenBalance]);

    const handleExistingRewardsValidation = useCallback(
        (address: Address, error?: string) => {
            if (!!error) {
                setExistingRewardsErrors((state) => [
                    ...state,
                    { address, error },
                ]);
            } else {
                setExistingRewardsErrors((state) =>
                    state.filter(
                        (existingRewardError) =>
                            existingRewardError.address !== address,
                    ),
                );
            }
        },
        [],
    );

    function handleRewardTokenButtonOnClick() {
        setOpen((open) => !open);
    }

    const handleRewardTokenChange = useCallback(
        (newToken: WhitelistedErc20Token) => {
            setRewardToken(newToken);
            setOpen(false);
        },
        [],
    );

    const handleRewardTokenOnAdd = useCallback(() => {
        if (!rewardAmount || !rewardAmount.floatValue || !rewardToken) return;

        const reward: WhitelistedErc20TokenAmount = {
            token: rewardToken,
            amount: {
                raw: parseUnits(rewardAmount.value, rewardToken.decimals),
                formatted: rewardAmount.floatValue,
                usdValue: rewardAmount.floatValue * rewardToken.usdPrice,
            },
        };

        const newRewards: CampaignPayload["rewards"] = rewards
            ? [...rewards, reward]
            : [reward];

        setOpen(false);
        setFeedbackVisible(true);

        onRewardsChange({ rewards: newRewards });
        setRewardAmount({
            floatValue: undefined,
            formattedValue: "",
            value: "",
        });
        setRewardToken(undefined);

        trackFathomEvent("PICK_REWARD");
    }, [onRewardsChange, rewardAmount, rewardToken, rewards]);

    const handleRewardTokenOnRemove = useCallback(
        (token: Erc20Token) => {
            if (!rewards) return;

            onRewardsChange({
                rewards: rewards.filter(
                    (reward) => reward.token.address !== token.address,
                ),
            });
        },
        [onRewardsChange, rewards],
    );

    const handleRewardTokenOnUpdate = useCallback(
        (updatedReward: WhitelistedErc20TokenAmount) => {
            if (!rewards) return;

            onRewardsChange({
                rewards: rewards.map((reward) => {
                    if (reward.token.address === updatedReward.token.address)
                        return updatedReward;
                    return reward;
                }),
            });
        },
        [onRewardsChange, rewards],
    );

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!disabled}
            error={!!rewardsError}
            className={styles.step}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <Typography
                            uppercase
                            weight="medium"
                            variant="sm"
                            className={styles.previewLabel}
                        >
                            {t("newCampaign.form.rewards.title.rewards")}
                        </Typography>
                        <ErrorText
                            variant="xs"
                            weight="medium"
                            className={classNames(styles.error, {
                                [styles.errorVisible]: !!rewardsError,
                            })}
                        >
                            {rewardsError && t(rewardsError)}
                        </ErrorText>
                    </div>
                }
                decorator={disabled}
                className={{ root: !disabled ? styles.stepPreview : "" }}
            >
                <div className={styles.previewWrapper}>
                    <RewardsPreview
                        rewards={rewards}
                        campaignDuration={campaignDuration}
                        onRemove={handleRewardTokenOnRemove}
                        onError={handleExistingRewardsValidation}
                        onUpdate={handleRewardTokenOnUpdate}
                    />
                    <div className={styles.totalValueWrapper}>
                        <Typography
                            uppercase
                            variant="xs"
                            weight="medium"
                            light
                        >
                            {formatUsdAmount(totalRewardsUsdAmount)}
                        </Typography>
                        <Typography
                            uppercase
                            variant="xs"
                            weight="medium"
                            light
                        >
                            {t("newCampaign.form.rewards.totalUsd")}
                        </Typography>
                    </div>
                    <hr className={styles.horizontalDivider} />
                    <div className={styles.rewardPickerWrapper}>
                        <NumberInput
                            placeholder="0"
                            label={t("newCampaign.form.rewards.title.add")}
                            value={rewardAmount?.formattedValue}
                            allowNegative={false}
                            onValueChange={setRewardAmount}
                            className={styles.rewardTokenAmountInput}
                        />
                        <div
                            onClick={handleRewardTokenButtonOnClick}
                            className={styles.rewardTokenSelect}
                        >
                            <RemoteLogo
                                size="xs"
                                address={rewardToken?.address}
                                chain={chainId}
                                defaultText=" "
                            />
                            <Typography
                                weight="medium"
                                className={styles.rewardTokenSymbol}
                            >
                                {rewardToken?.symbol ||
                                    t(
                                        "newCampaign.form.rewards.selectPlaceholder",
                                    )}
                            </Typography>
                            <ChevronDown className={styles.chevronDown} />
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="small"
                        icon={
                            feedbackVisible
                                ? BorderedTickIcon
                                : BorderedPlusIcon
                        }
                        disabled={
                            rewards?.length === 5 ||
                            !rewardAmount ||
                            !rewardToken ||
                            !!rewardAmountError
                        }
                        onClick={handleRewardTokenOnAdd}
                        className={{
                            root: styles.addRewardButton,
                        }}
                    >
                        {feedbackVisible
                            ? t("newCampaign.form.rewards.addButton.added")
                            : t("newCampaign.form.rewards.addButton.add")}
                    </Button>
                </div>
            </StepPreview>
            <StepContent>
                <RewardTokensList
                    unavailable={rewards}
                    value={rewardToken}
                    onRewardTokenClick={handleRewardTokenChange}
                />
            </StepContent>
        </Step>
    );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatUnits, type Address } from "viem";
import {
    Button,
    NumberInput,
    RemoteLogo,
    Typography,
    ErrorText,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useAccount, useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import type {
    Token,
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
import { PlusIcon } from "@/src/assets/plus-icon";
import { ChevronDown } from "@/src/assets/chevron-down";
import { RewardsPreview } from "./preview";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { formatUsdAmount } from "@/src/utils/format";
import classNames from "classnames";
import { trackFathomEvent } from "@/src/utils/fathom";

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
    const [rewardAmount, setRewardAmount] = useState<number | undefined>();
    const [rewardToken, setRewardToken] = useState<WhitelistedErc20Token>();
    const [rewardAmountError, setRewardAmountError] = useState("");
    const [existingRewardsErrors, setExistingRewardsErrors] = useState<
        {
            address: Address;
            error?: string;
        }[]
    >([]);

    const { address } = useAccount();
    const chainId = useChainId();

    const { balance: rewardTokenBalance } = useWatchBalance(
        address,
        rewardToken?.address,
    );

    const totalRewardsUsdAmount = useMemo(() => {
        if (!rewards) return 0;
        return rewards.reduce((accumulator, reward) => {
            if (!reward.usdPrice) return 0;
            return (accumulator += reward.amount * reward.usdPrice);
        }, 0);
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
        if (disabled || !!rewards) return;
        setOpen(true);
    }, [rewards, disabled]);

    useEffect(() => {
        if (!campaignDuration || !rewardToken) return;

        if (rewardAmount === undefined) {
            setRewardAmountError("");
            return;
        }

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

    const handleRewardAmountOnChange = useCallback(
        (rawNewAmount: NumberFormatValues) => {
            setRewardAmount(rawNewAmount.floatValue);
        },
        [],
    );

    const handleRewardTokenOnAdd = useCallback(() => {
        if (!rewardAmount || !rewardToken) return;

        const { address, decimals, name, symbol, minimumRate, usdPrice } =
            rewardToken;
        const reward: WhitelistedErc20TokenAmount = {
            token: { address, decimals, name, symbol },
            amount: rewardAmount,
            usdPrice,
            minimumRate,
        };
        const newRewards: CampaignPayload["rewards"] = rewards
            ? [...rewards, reward]
            : [reward];

        onRewardsChange({ rewards: newRewards });
        setOpen(false);
        setRewardAmount(undefined);
        setRewardToken(undefined);
        trackFathomEvent("PICK_REWARD");
    }, [onRewardsChange, rewardAmount, rewardToken, rewards]);

    const handleRewardTokenOnRemove = useCallback(
        (token: Token) => {
            if (!rewards) return;

            onRewardsChange({
                rewards: rewards.filter(
                    (reward) => reward.token.address !== token.address,
                ),
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
                            {t("newCampaign.form.rewards.title")}
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
                className={{ root: styles.stepPreview }}
            >
                <div className={styles.previewWrapper}>
                    <RewardsPreview
                        rewards={rewards}
                        campaignDuration={campaignDuration}
                        onRemove={handleRewardTokenOnRemove}
                        onError={handleExistingRewardsValidation}
                    />
                    <div className={styles.rewardPickerWrapper}>
                        <NumberInput
                            placeholder="0"
                            value={rewardAmount ? rewardAmount.toString() : ""}
                            onValueChange={handleRewardAmountOnChange}
                            className={styles.rewardTokenAmountInput}
                        />
                        <div
                            className={styles.rewardTokenSelect}
                            onClick={handleRewardTokenButtonOnClick}
                        >
                            <RemoteLogo
                                size="xs"
                                address={rewardToken?.address}
                                chain={chainId}
                            />
                            <Typography weight="medium">
                                {rewardToken?.symbol ||
                                    t(
                                        "newCampaign.form.rewards.selectPlaceholder",
                                    )}
                            </Typography>
                            <ChevronDown />
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="xsmall"
                        icon={PlusIcon}
                        disabled={
                            rewards?.length === 5 ||
                            !rewardAmount ||
                            !rewardToken ||
                            !!rewardAmountError
                        }
                        onClick={handleRewardTokenOnAdd}
                        className={{
                            root: styles.addRewardButton,
                            contentWrapper: styles.addRewardButtonContent,
                            icon: styles.addRewardButtonIcon,
                        }}
                    >
                        {t("newCampaign.form.rewards.add")}
                    </Button>
                    <Typography uppercase variant="sm" weight="medium" light>
                        {t("newCampaign.form.rewards.totalUsd")}
                    </Typography>
                    <Typography uppercase weight="bold" light>
                        {formatUsdAmount(totalRewardsUsdAmount)}
                    </Typography>
                </div>
            </StepPreview>
            <StepContent>
                <RewardTokensList
                    unavailable={rewards}
                    value={rewardToken}
                    onRewardTokenClick={setRewardToken}
                />
            </StepContent>
        </Step>
    );
}

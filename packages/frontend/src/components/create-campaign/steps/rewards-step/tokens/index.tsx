import type { Erc20Token, RewardToken } from "@metrom-xyz/sdk";
import { type Address, parseUnits, formatUnits } from "viem";
import { RewardsPreview } from "./preview";
import {
    Button,
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ChevronDown } from "@/src/assets/chevron-down";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useChainId } from "wagmi";
import { BorderedPlusIcon } from "@/src/assets/bordered-plus-icon";
import type {
    BaseCampaignPayload,
    CampaignPayloadErrors,
    BaseCampaignPayloadPart,
    WhitelistedErc20TokenAmount,
} from "@/src/types";
import { trackFathomEvent } from "@/src/utils/fathom";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { WhitelistedTokensList } from "../whitelisted-tokens-list";
import { useRewardTokens } from "@/src/hooks/useRewardTokens";

import styles from "./styles.module.css";

interface RewardTokensProps {
    tokens?: BaseCampaignPayload["tokens"];
    campaignDuration?: number;
    onError: (errors: CampaignPayloadErrors, error?: string) => void;
    onTokensChange: (tokens: BaseCampaignPayloadPart) => void;
}

export function RewardTokens({
    tokens,
    campaignDuration,
    onError,
    onTokensChange,
}: RewardTokensProps) {
    const t = useTranslations("newCampaign.form.base.rewards.tokens");
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState<NumberFormatValues>();
    const [token, setToken] = useState<RewardToken>();
    const [amountError, setAmountError] = useState("");
    const [existingTokensErrors, setExistingTokensErrors] = useState<
        {
            address: Address;
            error?: string;
        }[]
    >([]);

    const { address } = useAccount();
    const chainId = useChainId();
    const { balance: tokenBalance } = useWatchBalance(address, token?.address);
    const { tokens: rewardTokens, loading } = useRewardTokens();

    const rewardsError = useMemo(() => {
        if (!!amountError) return amountError;
        if (!tokens || tokens.length === 0) return "";

        return existingTokensErrors.length > 0
            ? existingTokensErrors[0].error
            : "";
    }, [existingTokensErrors, amountError, tokens]);

    const totalRewardsUsdAmount = useMemo(() => {
        if (!tokens) return 0;
        let total = 0;
        for (const token of tokens) {
            if (!token.amount.usdValue) return 0;
            total += token.amount.usdValue;
        }
        return total;
    }, [tokens]);

    useEffect(() => {
        if (!campaignDuration || !token) return;

        if (!amount || amount.floatValue === undefined) {
            setAmountError("");
            return;
        }

        const distributionRate = (amount.floatValue * 3_600) / campaignDuration;
        const balance =
            tokenBalance !== undefined
                ? Number(formatUnits(tokenBalance, token.decimals))
                : Number.MAX_SAFE_INTEGER;

        const error =
            amount.floatValue > balance
                ? "errors.insufficientBalance"
                : distributionRate < token.minimumRate.formatted
                  ? "errors.lowDistributionRate"
                  : "";

        setAmountError(error);
    }, [campaignDuration, amount, token, tokenBalance]);

    useEffect(() => {
        onError(
            { rewards: !!rewardsError },
            rewardsError ? t(rewardsError) : "",
        );
    }, [onError, rewardsError, t]);

    const handleRewardTokenOnAdd = useCallback(() => {
        if (!amount || !amount.floatValue || !token) return;

        const reward: WhitelistedErc20TokenAmount = {
            token: token,
            amount: {
                raw: parseUnits(amount.value, token.decimals),
                formatted: amount.floatValue,
                usdValue: amount.floatValue * token.usdPrice,
            },
        };

        const newRewards: BaseCampaignPayload["tokens"] = tokens
            ? [...tokens, reward]
            : [reward];

        setOpen(false);

        onTokensChange({ tokens: newRewards });
        setAmount({
            floatValue: undefined,
            formattedValue: "",
            value: "",
        });
        setToken(undefined);

        trackFathomEvent("PICK_REWARD");
    }, [amount, token, tokens, onTokensChange]);

    const handleRewardTokenOnRemove = useCallback(
        (reward: Erc20Token) => {
            if (!tokens) return;

            onTokensChange({
                tokens: tokens.filter(
                    ({ token }) => token.address !== reward.address,
                ),
            });
        },
        [onTokensChange, tokens],
    );

    const handleRewardTokenOnUpdate = useCallback(
        (updatedReward: WhitelistedErc20TokenAmount) => {
            if (!tokens) return;

            onTokensChange({
                tokens: tokens.map((reward) => {
                    if (reward.token.address === updatedReward.token.address)
                        return updatedReward;
                    return reward;
                }),
            });
        },
        [onTokensChange, tokens],
    );

    const handleExistingTokensValidation = useCallback(
        (address: Address, error?: string) => {
            if (!!error) {
                setExistingTokensErrors((state) => [
                    ...state,
                    { address, error },
                ]);
            } else {
                setExistingTokensErrors((state) =>
                    state.filter(
                        (existingRewardError) =>
                            existingRewardError.address !== address,
                    ),
                );
            }
        },
        [],
    );

    function handleTokenButtonOnClick() {
        setOpen((prev) => !prev);
    }

    const handleRewardTokenChange = useCallback((newToken: RewardToken) => {
        setToken(newToken);
        setOpen(false);
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <RewardsPreview
                    rewards={tokens}
                    campaignDuration={campaignDuration}
                    onRemove={handleRewardTokenOnRemove}
                    onUpdate={handleRewardTokenOnUpdate}
                    onError={handleExistingTokensValidation}
                />
                <div className={styles.totalValueWrapper}>
                    <Typography uppercase size="xs" weight="medium" light>
                        {formatUsdAmount(totalRewardsUsdAmount)}
                    </Typography>
                    <Typography uppercase size="xs" weight="medium" light>
                        {t("totalUsd")}
                    </Typography>
                </div>
                <hr className={styles.horizontalDivider} />
                <div className={styles.rewardPickerWrapper}>
                    <NumberInput
                        placeholder="0"
                        label={t("enterReward")}
                        value={amount?.formattedValue}
                        allowNegative={false}
                        onValueChange={setAmount}
                        className={styles.rewardTokenAmountInput}
                    />
                    <div
                        onClick={handleTokenButtonOnClick}
                        className={styles.rewardTokenSelect}
                    >
                        {token && (
                            <RemoteLogo
                                size="xs"
                                address={token.address}
                                chain={chainId}
                                defaultText=" "
                            />
                        )}
                        <Typography
                            weight="medium"
                            size="sm"
                            className={styles.rewardTokenSymbol}
                        >
                            {token?.symbol || t("selectPlaceholder")}
                        </Typography>
                        <ChevronDown className={styles.chevronDown} />
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    icon={BorderedPlusIcon}
                    disabled={
                        tokens?.length === 5 ||
                        !amount ||
                        !token ||
                        !!amountError
                    }
                    onClick={handleRewardTokenOnAdd}
                    className={{
                        root: styles.addRewardButton,
                    }}
                >
                    {t("addButton.add")}
                </Button>
            </div>
            <WhitelistedTokensList
                open={open}
                loading={loading}
                value={token}
                values={rewardTokens}
                unavailable={tokens}
                onClick={handleRewardTokenChange}
            />
        </div>
    );
}

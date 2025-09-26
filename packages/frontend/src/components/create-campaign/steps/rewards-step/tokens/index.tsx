import {
    DistributablesType,
    type Erc20Token,
    type RewardToken,
} from "@metrom-xyz/sdk";
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
import { ChevronDownIcon } from "@/src/assets/chevron-down-icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useAccount } from "@/src/hooks/useAccount";
import type {
    CampaignPayloadErrors,
    BaseCampaignPayloadPart,
    CampaignPayloadTokenDistributables,
} from "@/src/types/campaign";
import type { WhitelistedErc20TokenAmount } from "@/src/types/common";
import type { LocalizedMessage } from "@/src/types/utils";
import { trackFathomEvent } from "@/src/utils/fathom";
import { useWatchBalance } from "@/src/hooks/use-watch-balance";
import { WhitelistedTokensList } from "../whitelisted-tokens-list";
import { useRewardTokens } from "@/src/hooks/useRewardTokens";

import styles from "./styles.module.css";

interface RewardTokensProps {
    distributables: CampaignPayloadTokenDistributables;
    campaignDuration?: number;
    onError: (errors: CampaignPayloadErrors, error?: string) => void;
    onTokensChange: (tokens: BaseCampaignPayloadPart) => void;
}

export type TokensErrorMessage =
    LocalizedMessage<"newCampaign.form.base.rewards.tokens">;

export function RewardTokens({
    distributables,
    campaignDuration,
    onError,
    onTokensChange,
}: RewardTokensProps) {
    const t = useTranslations("newCampaign.form.base.rewards.tokens");
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState<NumberFormatValues>();
    const [token, setToken] = useState<RewardToken>();
    const [amountError, setAmountError] = useState<TokensErrorMessage>("");
    const [existingTokensErrors, setExistingTokensErrors] = useState<
        {
            address: Address;
            error?: TokensErrorMessage;
        }[]
    >([]);

    const { address } = useAccount();
    const { id: chainId } = useChainWithType();
    const { balance: tokenBalance } = useWatchBalance({
        address,
        token: token?.address,
    });
    const { tokens: rewardTokens, loading } = useRewardTokens();

    const rewardsError = useMemo(() => {
        if (amountError) return amountError;
        if (!distributables.tokens || distributables.tokens.length === 0)
            return "";

        return existingTokensErrors.length > 0
            ? existingTokensErrors[0].error
            : "";
    }, [existingTokensErrors, amountError, distributables.tokens]);

    const totalRewardsUsdAmount = useMemo(() => {
        if (!distributables.tokens) return 0;
        let total = 0;
        for (const token of distributables.tokens) {
            if (!token.amount.usdValue) return 0;
            total += token.amount.usdValue;
        }
        return total;
    }, [distributables.tokens]);

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

        const newRewards: WhitelistedErc20TokenAmount[] = distributables.tokens
            ? [...distributables.tokens, reward]
            : [reward];

        setOpen(false);

        onTokensChange({
            distributables: {
                type: DistributablesType.Tokens,
                tokens: newRewards,
            },
        });
        setAmount({
            floatValue: undefined,
            formattedValue: "",
            value: "",
        });
        setToken(undefined);

        trackFathomEvent("PICK_REWARD");
    }, [amount, token, distributables.tokens, onTokensChange]);

    const handleRewardTokenOnRemove = useCallback(
        (reward: Erc20Token) => {
            if (!distributables.tokens) return;

            onTokensChange({
                distributables: {
                    type: DistributablesType.Tokens,
                    tokens: distributables.tokens.filter(
                        ({ token }) => token.address !== reward.address,
                    ),
                },
            });
        },
        [onTokensChange, distributables.tokens],
    );

    const handleRewardTokenOnUpdate = useCallback(
        (updatedReward: WhitelistedErc20TokenAmount) => {
            if (!distributables.tokens) return;

            onTokensChange({
                distributables: {
                    type: DistributablesType.Tokens,
                    tokens: distributables.tokens.map((reward) => {
                        if (
                            reward.token.address === updatedReward.token.address
                        )
                            return updatedReward;
                        return reward;
                    }),
                },
            });
        },
        [onTokensChange, distributables.tokens],
    );

    const handleExistingTokensValidation = useCallback(
        (address: Address, error?: TokensErrorMessage) => {
            if (error) {
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
                    distributables={distributables}
                    campaignDuration={campaignDuration}
                    onRemove={handleRewardTokenOnRemove}
                    onUpdate={handleRewardTokenOnUpdate}
                    onError={handleExistingTokensValidation}
                />
                <div className={styles.totalValueWrapper}>
                    <Typography uppercase size="xs" weight="medium" light>
                        {formatUsdAmount({ amount: totalRewardsUsdAmount })}
                    </Typography>
                    <Typography uppercase size="xs" weight="medium" light>
                        {t("totalUsd")}
                    </Typography>
                </div>
                <div className={styles.horizontalDivider} />
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
                        <ChevronDownIcon className={styles.chevronDown} />
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={
                        distributables.tokens?.length === 5 ||
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
                unavailable={distributables.tokens}
                onClick={handleRewardTokenChange}
            />
        </div>
    );
}

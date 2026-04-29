import { useRewardTokens } from "@/src/hooks/useRewardTokens";
import type {
    BaseCampaignPayloadPart,
    CampaignPayloadTokenDistributables,
} from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
    RewardsPickerTokensSelect,
    type RewardsPickerSelectOptionData,
} from "../select";
import {
    Button,
    NumberInput,
    type NumberFormatValues,
    type SelectOption,
} from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { DistributablesType, type Erc20Token } from "@metrom-xyz/sdk";
import type { WhitelistedErc20TokenAmount } from "@/src/types/common";
import { type Address } from "viem";
import { trackFathomEvent } from "@/src/utils/fathom";
import type { LocalizedMessage } from "@/src/types/utils";
import { Reward } from "./reward";
import { useAccount } from "@/src/hooks/useAccount";
import { useWatchBalance } from "@/src/hooks/use-watch-balance";
import { formatUnits, parseUnits } from "@/src/utils/format";
import type { FormSteps } from "@/src/context/form-steps";

import styles from "./styles.module.css";

interface RewardsPickerTokensProps {
    chainId?: number;
    campaignDuration?: number;
    value?: CampaignPayloadTokenDistributables;
    onChange: (value: BaseCampaignPayloadPart) => void;
    onError: (errors: FormSteps<string>) => void;
}

export type RewardsPickerErrorMessage =
    LocalizedMessage<"newCampaign.inputs.rewardsPicker">;

export function RewardsPickerTokens({
    chainId,
    campaignDuration,
    value,
    onChange,
    onError,
}: RewardsPickerTokensProps) {
    const [token, setToken] =
        useState<SelectOption<string, RewardsPickerSelectOptionData>>();
    const [amount, setAmount] = useState<NumberFormatValues>();
    const [amountError, setAmountError] = useState<RewardsPickerErrorMessage>();
    const [errors, setErrors] = useState<
        { address: Address; error?: RewardsPickerErrorMessage }[]
    >([]);

    const t = useTranslations("newCampaign.inputs.rewardsPicker");
    const { tokens, loading } = useRewardTokens({ chainId });
    const { address } = useAccount();
    const { balance: rewardTokenBalance } = useWatchBalance({
        chainId,
        address,
        token: token?.data?.token.address,
    });

    useEffect(() => {
        if (!campaignDuration || !token || !token.data) return;

        if (!amount || amount.floatValue === undefined) {
            setAmountError("");
            return;
        }

        const distributionRate = (amount.floatValue * 3_600) / campaignDuration;
        const balance =
            rewardTokenBalance !== undefined
                ? Number(
                      formatUnits(
                          rewardTokenBalance,
                          token.data.token.decimals,
                      ),
                  )
                : Number.MAX_SAFE_INTEGER;

        const error =
            amount.floatValue > balance
                ? "errors.insufficientBalance"
                : distributionRate < token.data.token.minimumRate.formatted
                  ? "errors.lowDistributionRate"
                  : "";

        setAmountError(error);
    }, [campaignDuration, amount, token, rewardTokenBalance]);

    useEffect(() => {
        if (!errors || errors.length === 0) {
            onError({ rewards: undefined });
            return;
        }
        if (!errors[0].error) return;
        onError({ rewards: t(errors[0].error) });
    }, [errors, onError, t]);

    const handleOnAdd = useCallback(() => {
        if (!amount || !amount.floatValue || !token || !token.data) return;

        const reward: WhitelistedErc20TokenAmount = {
            token: token.data.token,
            amount: {
                raw: parseUnits(amount.value, token.data.token.decimals),
                formatted: amount.floatValue,
                usdValue: amount.floatValue * token.data.token.usdPrice,
            },
        };

        const newRewards: WhitelistedErc20TokenAmount[] = value?.tokens
            ? [...value.tokens, reward]
            : [reward];

        onChange({
            distributables: {
                type: DistributablesType.Tokens,
                tokens: newRewards,
            },
        });
        setToken(undefined);
        setAmount({ floatValue: undefined, formattedValue: "", value: "" });
        trackFathomEvent("PICK_REWARD");
    }, [amount, token, value?.tokens, onChange]);

    const handleOnUpdate = useCallback(
        (newReward: WhitelistedErc20TokenAmount) => {
            if (!value?.tokens) return;

            onChange({
                distributables: {
                    type: DistributablesType.Tokens,
                    tokens: value.tokens.map((reward) => {
                        if (reward.token.address === newReward.token.address)
                            return newReward;
                        return reward;
                    }),
                },
            });
        },
        [value?.tokens, onChange],
    );

    const handleOnRemove = useCallback(
        (reward: Erc20Token) => {
            if (!value?.tokens) return;

            onChange({
                distributables: {
                    type: DistributablesType.Tokens,
                    tokens: value.tokens.filter(
                        ({ token }) => token.address !== reward.address,
                    ),
                },
            });
        },
        [value?.tokens, onChange],
    );

    const handleOnError = useCallback(
        (address: Address, error?: RewardsPickerErrorMessage) => {
            if (error) {
                setErrors((state) => {
                    if (state.length === 0) return [{ address, error }];

                    if (!state.some((item) => item.address === address))
                        return [...state, { address, error }];

                    return state.map((item) => {
                        if (item.address !== address) return item;
                        return { ...item, error };
                    });
                });
            } else {
                setErrors((state) =>
                    state.filter((item) => item.address !== address),
                );
            }
        },
        [],
    );

    return (
        <div className={styles.root}>
            <div className={styles.inputs}>
                <RewardsPickerTokensSelect
                    chainId={chainId}
                    tokens={tokens}
                    loading={loading}
                    value={token}
                    unavailables={value?.tokens}
                    onChange={setToken}
                />
                <NumberInput
                    size="lg"
                    value={amount?.formattedValue}
                    placeholder="0"
                    allowNegative={false}
                    error={!!amountError}
                    errorText={amountError ? t(amountError) : undefined}
                    onValueChange={setAmount}
                    endAdornment={
                        <Button
                            disabled={
                                !token ||
                                !amount?.formattedValue ||
                                !!amountError
                            }
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            onClick={handleOnAdd}
                            className={{ root: styles.button }}
                        >
                            {t("add")}
                        </Button>
                    }
                    className={styles.input}
                />
            </div>
            {value?.tokens?.map((token) => {
                const error = errors.find(
                    ({ address }) => address === token.token.address,
                );
                return (
                    <Reward
                        key={token.token.address}
                        chainId={chainId}
                        campaignDuration={campaignDuration}
                        tokens={tokens}
                        value={token}
                        error={error?.error}
                        onError={handleOnError}
                        onRemove={handleOnRemove}
                        onUpdate={handleOnUpdate}
                    />
                );
            })}
        </div>
    );
}

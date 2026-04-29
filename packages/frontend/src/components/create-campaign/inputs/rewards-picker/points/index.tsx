import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    type NumberFormatValues,
    NumberInput,
    type SelectOption,
    Typography,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { LocalizedMessage } from "@/src/types/utils";
import { formatUsdAmount, parseUnits } from "@/src/utils/format";
import { usePrevious } from "react-use";
import { useFeeTokens } from "@/src/hooks/useFeeTokens";
import {
    RewardsPickerTokensSelect,
    type RewardsPickerSelectOptionData,
} from "../select";
import type {
    BaseCampaignPayloadPart,
    CampaignPayloadFixedPointDistributables,
} from "@/src/types/campaign/common";
import type { FormSteps } from "@/src/context/form-steps";
import { BoldText } from "@/src/components/bold-text";
import { DistributablesType } from "@metrom-xyz/sdk";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

export interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

interface RewardPointsProps {
    chainId?: number;
    campaignDuration?: number;
    value?: CampaignPayloadFixedPointDistributables;
    onChange: (value: BaseCampaignPayloadPart) => void;
    onError: (errors: FormSteps<string>) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.base.rewards.points">;

export function RewardPoints({
    chainId,
    campaignDuration,
    value,
    onChange,
    onError,
}: RewardPointsProps) {
    const t = useTranslations("newCampaign.form.base.rewards.points");
    const [costError, setCostError] = useState<ErrorMessage>();
    const [amountError, setAmountError] = useState<ErrorMessage>();
    const [amount, setAmount] = useState<NumberFormatValues>();
    const [token, setToken] =
        useState<SelectOption<string, RewardsPickerSelectOptionData>>();

    const prevCampaignDuration = usePrevious(campaignDuration);

    const { tokens: feeTokens, loading } = useFeeTokens();

    const unsavedChanges = useMemo(() => {
        if (!amount || !token || !!costError) return true;

        if (value?.fee && value?.points !== undefined)
            return (
                amount.floatValue !== value.points ||
                token.data?.token.address !== value.fee.token.address
            );

        return (
            amount.floatValue !== value?.points ||
            token.data?.token.address !== value?.fee?.token.address
        );
    }, [amount, costError, token, value?.fee, value?.points]);

    const resolvedFee = useMemo(() => {
        if (!token?.data || !campaignDuration) return undefined;
        const {
            token: { usdPrice, minimumRate },
        } = token.data;

        const amount = (minimumRate.formatted * campaignDuration) / 3_600;
        const usd = amount * usdPrice;

        return { amount, usd };
    }, [campaignDuration, token]);

    useEffect(() => {
        const error = costError || amountError;
        onError({ rewards: error ? t(error) : undefined });
    }, [onError, costError, t, amountError]);

    useEffect(() => {
        if (
            resolvedFee &&
            campaignDuration &&
            campaignDuration !== prevCampaignDuration
        )
            setCostError("errors.costChanged");
    }, [campaignDuration, resolvedFee, prevCampaignDuration]);

    useEffect(() => {
        if (value?.points === 0) setAmountError("errors.wrongAmount");
        else setAmountError("");
    }, [value?.points]);

    useEffect(() => {
        if (!token?.data || !campaignDuration || !resolvedFee || !amount)
            return;
    }, [resolvedFee, amount, token?.data, campaignDuration, onChange]);

    const handleOnApply = useCallback(() => {
        if (!amount || !token?.data || !resolvedFee) return;

        setCostError(undefined);
        setAmountError(undefined);
        onChange({
            distributables: {
                type: DistributablesType.FixedPoints,
                points: amount.floatValue,
                fee: {
                    token: token.data.token,
                    amount: {
                        raw: parseUnits(
                            resolvedFee.amount.toString(),
                            token.data.token.decimals,
                        ),
                        formatted: resolvedFee.amount,
                        usdValue: resolvedFee.usd,
                    },
                },
            },
        });
    }, [amount, token?.data, resolvedFee, onChange]);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography
                    variant="tertiary"
                    weight="medium"
                    size="xs"
                    uppercase
                >
                    {t.rich("usdCost", {
                        usd: formatUsdAmount({ amount: resolvedFee?.usd }),
                        bold: (chunks) => <BoldText>{chunks}</BoldText>,
                    })}
                </Typography>
                {costError && (
                    <Typography
                        size="xs"
                        weight="medium"
                        className={styles.errorText}
                    >
                        {t(costError)}
                    </Typography>
                )}
            </div>
            <div className={styles.inputs}>
                <RewardsPickerTokensSelect
                    label={t("feeToken")}
                    chainId={chainId}
                    tokens={feeTokens}
                    loading={loading}
                    value={token}
                    onChange={setToken}
                    className={styles.tokenSelect}
                />
                <NumberInput
                    size="lg"
                    label={t("amount")}
                    placeholder="0"
                    disabled={!token}
                    error={!!amountError}
                    errorText={amountError ? t(amountError) : undefined}
                    value={amount?.formattedValue}
                    allowNegative={false}
                    onValueChange={setAmount}
                />
                <Button
                    size="sm"
                    disabled={
                        !unsavedChanges ||
                        !token ||
                        !amount?.formattedValue ||
                        !!amountError
                    }
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    onClick={handleOnApply}
                    className={{ root: styles.button }}
                >
                    {t("apply")}
                </Button>
            </div>
        </div>
    );
}

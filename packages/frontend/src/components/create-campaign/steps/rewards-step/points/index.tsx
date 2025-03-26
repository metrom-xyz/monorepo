import { WhitelistedTokensList } from "../whitelisted-tokens-list";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    type NumberFormatValues,
    NumberInput,
    Typography,
} from "@metrom-xyz/ui";
import { ChevronDown } from "@/src/assets/chevron-down";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { parseUnits } from "viem";
import { RemoteLogo } from "@/src/components/remote-logo";
import type {
    BaseCampaignPayload,
    CampaignPayloadErrors,
    BaseCampaignPayloadPart,
    LocalizedMessage,
} from "@/src/types/common";
import { formatUsdAmount } from "@/src/utils/format";
import { usePrevious } from "react-use";
import type { FeeToken } from "@metrom-xyz/sdk";
import { useFeeTokens } from "@/src/hooks/useFeeTokens";

import styles from "./styles.module.css";

export interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

interface RewardPointsProps {
    campaignDuration?: number;
    points?: BaseCampaignPayload["points"];
    fee?: BaseCampaignPayload["fee"];
    onError: (errors: CampaignPayloadErrors, error?: string) => void;
    onPointsChange: (points: BaseCampaignPayloadPart) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.base.rewards.points">;

export function RewardPoints({
    campaignDuration,
    points,
    fee,
    onError,
    onPointsChange,
}: RewardPointsProps) {
    const t = useTranslations("newCampaign.form.base.rewards.points");
    const [open, setOpen] = useState(false);
    const [costError, setCostError] = useState<ErrorMessage>("");
    const [amountError, setAmountError] = useState<ErrorMessage>("");
    const [amount, setAmount] = useState<NumberInputValues | undefined>(() => {
        if (points !== undefined)
            return {
                raw: points,
                formatted: points.toString(),
            };
        return undefined;
    });
    const [token, setToken] = useState<FeeToken | undefined>(fee?.token);

    const chainId = useChainId();
    const prevCampaignDuration = usePrevious(campaignDuration);

    const { tokens: feeTokens, loading } = useFeeTokens();

    const resolvedFee = useMemo(() => {
        if (!token || !campaignDuration) return undefined;

        const amount = (token.minimumRate.formatted * campaignDuration) / 3_600;
        const usd = amount * token.usdPrice;

        return { amount, usd };
    }, [campaignDuration, token]);

    const unsavedChanges = useMemo(() => {
        if (!amount || !token || !!costError) return true;

        if (fee && points !== undefined)
            return amount.raw !== points || token.address !== fee.token.address;

        return amount.raw !== points || token.address !== fee?.token.address;
    }, [amount, costError, fee, points, token]);

    useEffect(() => {
        if (
            resolvedFee &&
            campaignDuration &&
            campaignDuration !== prevCampaignDuration
        )
            setCostError("errors.costChanged");
    }, [campaignDuration, resolvedFee, prevCampaignDuration]);

    useEffect(() => {
        if (amount?.raw === 0) setAmountError("errors.wrongAmount");
        else setAmountError("");
    }, [amount?.raw]);

    useEffect(() => {
        const error = costError || amountError;
        onError({ rewards: !!error }, error ? t(error) : "");
    }, [onError, costError, t, amountError]);

    function handlePointsAmountOnChange(value: NumberFormatValues) {
        setAmount({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleTokenButtonOnClick() {
        setOpen((prev) => !prev);
    }

    const handleFeedTokenOnChange = useCallback((newToken: FeeToken) => {
        setToken(newToken);
        setOpen(false);
    }, []);

    const handleOnApply = useCallback(() => {
        if (!amount || !token || !resolvedFee) return;

        setCostError("");
        setOpen(false);
        onPointsChange({
            fee: {
                token,
                amount: {
                    raw: parseUnits(
                        resolvedFee.amount.toString(),
                        token.decimals,
                    ),
                    formatted: resolvedFee.amount,
                    usdValue: resolvedFee.usd,
                },
            },
            points: amount?.raw,
        });
    }, [token, amount, resolvedFee, onPointsChange]);

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <NumberInput
                    label={t("amount")}
                    placeholder="0"
                    error={!!amountError}
                    value={amount?.formatted}
                    allowNegative={false}
                    onValueChange={handlePointsAmountOnChange}
                />
                <div className={styles.feeTokenSelectWrapper}>
                    <div className={styles.feeTokenWrapper}>
                        {token && (
                            <RemoteLogo
                                size="sm"
                                address={token.address}
                                chain={chainId}
                                defaultText=" "
                            />
                        )}
                        {token ? (
                            <Typography weight="medium" size="lg">
                                {token?.symbol}
                            </Typography>
                        ) : (
                            <Typography
                                uppercase
                                light
                                weight="medium"
                                size="xs"
                            >
                                {t("pickFeeToken")}
                            </Typography>
                        )}
                    </div>
                    <div
                        onClick={handleTokenButtonOnClick}
                        className={styles.feeTokenSelect}
                    >
                        <Typography weight="medium" size="sm">
                            {t("select")}
                        </Typography>
                        <ChevronDown className={styles.chevronDown} />
                    </div>
                </div>
                <hr className={styles.horizontalDivider} />
                <Typography light weight="medium" size="xs" uppercase>
                    {t("usdCost", { usd: formatUsdAmount(resolvedFee?.usd) })}
                </Typography>
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={
                        !unsavedChanges ||
                        !amount?.raw ||
                        !token ||
                        !!amountError
                    }
                    onClick={handleOnApply}
                    className={{
                        root: styles.applyButton,
                    }}
                >
                    {t("apply")}
                </Button>
            </div>
            <WhitelistedTokensList
                open={open}
                loading={loading}
                value={token || fee?.token}
                values={feeTokens}
                onClick={handleFeedTokenOnChange}
            />
        </div>
    );
}

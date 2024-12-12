import { WhitelistedTokenType } from "@/src/hooks/useWhitelistedTokens";
import { WhitelistedTokensList } from "../whitelisted-tokens-list";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { WhitelistedErc20Token } from "@metrom-xyz/sdk";
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
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import { formatUsdAmount } from "@/src/utils/format";
import { usePrevious } from "react-use";

import styles from "./styles.module.css";

export interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

interface RewardPointsProps {
    campaignDuration?: number;
    points?: CampaignPayload["points"];
    feeToken?: CampaignPayload["feeToken"];
    onError: (errors: CampaignPayloadErrors, error?: string) => void;
    onPointsChange: (points: CampaignPayloadPart) => void;
}

export function RewardPoints({
    campaignDuration,
    points,
    feeToken,
    onError,
    onPointsChange,
}: RewardPointsProps) {
    const t = useTranslations("newCampaign.form.rewards.points");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState<NumberInputValues | undefined>(() => {
        if (points !== undefined)
            return {
                raw: points,
                formatted: points.toString(),
            };
        return undefined;
    });
    const [token, setToken] = useState<WhitelistedErc20Token | undefined>(
        feeToken?.token,
    );

    const chainId = useChainId();
    const prevCampaignDuration = usePrevious(campaignDuration);
    const prevRewardPoints = usePrevious({ points, feeToken });

    const fee = useMemo(() => {
        if (!token || !campaignDuration) return undefined;

        const amount = (token.minimumRate.formatted * campaignDuration) / 3_600;
        const usd = amount * token.usdPrice;

        return { amount, usd };
    }, [campaignDuration, token]);

    const unsavedChanges = useMemo(() => {
        if (!amount || !token || !!error) return true;

        if (prevRewardPoints?.feeToken && prevRewardPoints.points !== undefined)
            return (
                amount.raw !== prevRewardPoints.points ||
                token.address !== prevRewardPoints.feeToken.token.address
            );

        return (
            amount.raw !== points || token.address !== feeToken?.token.address
        );
    }, [
        prevRewardPoints?.points,
        prevRewardPoints?.feeToken,
        amount,
        points,
        feeToken?.token.address,
        token,
        error,
    ]);

    useEffect(() => {
        if (
            !fee ||
            !campaignDuration ||
            campaignDuration === prevCampaignDuration
        )
            return;
        setError("errors.costChanged");
    }, [campaignDuration, fee, prevCampaignDuration]);

    useEffect(() => {
        onError({ rewards: !!error }, error ? t(error) : "");
    }, [onError, error, t]);

    function handlePointsAmountOnChange(value: NumberFormatValues) {
        setAmount({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleTokenButtonOnClick() {
        setOpen((prev) => !prev);
    }

    const handleFeedTokenOnChange = useCallback(
        (newToken: WhitelistedErc20Token) => {
            setToken(newToken);
            setOpen(false);
        },
        [],
    );

    const handleOnApply = useCallback(() => {
        if (!amount || !token || !fee) return;

        setError("");
        setOpen(false);
        onPointsChange({
            feeToken: {
                token,
                amount: {
                    raw: parseUnits(fee.amount.toString(), token.decimals),
                    formatted: fee.amount,
                    usdValue: fee.usd,
                },
            },
            points: amount?.raw,
        });
    }, [token, amount, fee, onPointsChange]);

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <NumberInput
                    label={t("amount")}
                    placeholder="0"
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
                    {t("usdCost", { usd: formatUsdAmount(fee?.usd) })}
                </Typography>
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={!unsavedChanges || !amount || !token}
                    onClick={handleOnApply}
                    className={{
                        root: styles.applyButton,
                    }}
                >
                    {t("apply")}
                </Button>
            </div>
            <WhitelistedTokensList
                type={WhitelistedTokenType.Rewards}
                open={open}
                value={token || feeToken?.token}
                onRewardTokenClick={handleFeedTokenOnChange}
            />
        </div>
    );
}

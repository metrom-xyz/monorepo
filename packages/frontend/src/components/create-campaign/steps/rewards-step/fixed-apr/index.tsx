import { useTranslations } from "next-intl";
import {
    InfoTooltip,
    NumberInput,
    Toggle,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import type {
    BaseCampaignPayloadPart,
    CampaignPayloadFixedDistribution,
    CampaignPayloadKpiDistribution,
} from "@/src/types/campaign";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { NumberInputValues } from "../points";
import {
    formatAmount,
    formatPercentage,
    formatUsdAmount,
} from "@/src/utils/format";
import { getUsdBudgetForFixedApr } from "@/src/utils/creation-form";
import type {
    UsdPricedErc20TokenAmount,
    WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import { useRewardTokens } from "@/src/hooks/useRewardTokens";
import { useAccount } from "@/src/hooks/useAccount";
import { useWatchBalances } from "@/src/hooks/use-watch-balances";
import { formatUnits, parseUnits } from "viem";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useProtocolFees } from "@/src/hooks/useProtocolFees";
import { FEE_UNIT } from "@/src/commons";

import styles from "./styles.module.css";

interface RewardsFixedAprProps {
    kpiDistribution?: CampaignPayloadKpiDistribution;
    fixedDistribution?: CampaignPayloadFixedDistribution;
    startDate?: Dayjs;
    endDate?: Dayjs;
    onToggle: () => void;
    onFixedAprChange: (
        fixedApr: BaseCampaignPayloadPart,
        budgetToken?: UsdPricedErc20TokenAmount,
    ) => void;
}

const REFERENCE_TVL = 1_000_000;
const BUFFER_PERCENTAGE = 20;

export function RewardsFixedApr({
    kpiDistribution,
    fixedDistribution,
    startDate,
    endDate,
    onFixedAprChange,
    onToggle,
}: RewardsFixedAprProps) {
    const [apr, setApr] = useState<NumberInputValues | undefined>(() => {
        if (fixedDistribution) {
            return {
                raw: fixedDistribution?.apr,
                formatted: fixedDistribution?.apr?.toString(),
            };
        }
        return undefined;
    });
    const [enabled, setEnabled] = useState<boolean>(false);
    const [resolvedFee, setResolvedFee] = useState<number>();

    const t = useTranslations("newCampaign.form.base.rewards.fixedApr");
    const { fee, feeRebate } = useProtocolFees();
    const { id: chainId } = useChainWithType();
    const { address } = useAccount();
    const { tokens: rewardTokens, loading: loadingRewardTokens } =
        useRewardTokens();
    const {
        tokensWithBalance: rewardTokensWithBalance,
        loading: loadingRewardTokensBalances,
    } = useWatchBalances<WhitelistedErc20Token>({
        address,
        tokens: rewardTokens,
        enabled,
    });

    useEffect(() => {
        if (fee !== undefined && feeRebate !== undefined) {
            const resolvedFeeRebate = feeRebate / FEE_UNIT;
            setResolvedFee(fee - fee * resolvedFeeRebate);
        }
    }, [feeRebate, fee]);

    const {
        tokenBudget,
        dailyEmission,
    }: {
        tokenBudget: UsdPricedErc20TokenAmount | null;
        dailyEmission: UsdPricedErc20TokenAmount | null;
    } = useMemo(() => {
        if (
            resolvedFee === undefined ||
            !endDate ||
            !startDate ||
            !rewardTokens ||
            !rewardTokensWithBalance ||
            loadingRewardTokens ||
            loadingRewardTokensBalances
        )
            return {
                tokenBudget: null,
                dailyEmission: null,
            };

        const hoursDuration = endDate.diff(startDate, "hours", false);
        const daysDuration = hoursDuration / 24;
        const usdBudget = getUsdBudgetForFixedApr(
            REFERENCE_TVL,
            BUFFER_PERCENTAGE,
            daysDuration,
            apr?.raw,
        );
        const usdBudgetWithoutBuffer = getUsdBudgetForFixedApr(
            REFERENCE_TVL,
            0,
            daysDuration,
            apr?.raw,
        );

        let rewardToken: WhitelistedErc20Token | null = null;
        if (!address) rewardToken = rewardTokens[0];
        else {
            rewardToken =
                rewardTokensWithBalance.find(({ balance, token }) => {
                    if (!balance) return false;
                    return balance.formatted * token.usdPrice > usdBudget;
                })?.token || rewardTokens[0];
        }

        const formattedBudget =
            (usdBudget * FEE_UNIT) /
            (FEE_UNIT - resolvedFee) /
            rewardToken.usdPrice;
        const rawBudget = parseUnits(
            formattedBudget.toFixed(),
            rewardToken.decimals,
        );

        const formattedBudgetWithoutBuffer =
            usdBudgetWithoutBuffer / rewardToken.usdPrice;
        const rawBudgetWithoutBuffer = parseUnits(
            formattedBudgetWithoutBuffer.toFixed(),
            rewardToken.decimals,
        );
        const rawHourlyEmission =
            rawBudgetWithoutBuffer / BigInt(Math.ceil(hoursDuration));
        const rawDailyEmission = rawHourlyEmission * 24n;
        const formattedDailyEmission = Number(
            formatUnits(rawDailyEmission, rewardToken.decimals),
        );

        return {
            tokenBudget: {
                token: rewardToken,
                amount: {
                    raw: rawBudget,
                    formatted: formattedBudget,
                    usdValue: formattedBudget * rewardToken.usdPrice,
                },
            },
            dailyEmission: {
                token: rewardToken,
                amount: {
                    raw: rawDailyEmission,
                    formatted: formattedDailyEmission,
                    usdValue: formattedDailyEmission * rewardToken.usdPrice,
                },
            },
        };
    }, [
        resolvedFee,
        rewardTokens,
        rewardTokensWithBalance,
        loadingRewardTokens,
        loadingRewardTokensBalances,
        apr?.raw,
        startDate,
        endDate,
        address,
    ]);

    const handleToggleOnClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (enabled) {
                setApr(undefined);
                onFixedAprChange({
                    fixedDistribution: undefined,
                });
            } else if (tokenBudget)
                onFixedAprChange({ fixedDistribution: {} }, tokenBudget);

            event.stopPropagation();
            setEnabled((enabled) => !enabled);
            onToggle();
        },
        [enabled, tokenBudget, onFixedAprChange, onToggle],
    );

    function handleAprOnChange(value: NumberFormatValues) {
        setApr({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    const handleAprOnBlur = useCallback(() => {
        if (!tokenBudget) return;

        onFixedAprChange({ fixedDistribution: { apr: apr?.raw } }, tokenBudget);
    }, [tokenBudget, apr, onFixedAprChange]);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <Typography size="sm" weight="medium">
                        {t("title")}
                    </Typography>
                    <Typography size="xs" variant="secondary">
                        {t("description")}
                    </Typography>
                </div>
                <Toggle
                    checked={enabled}
                    disabled={!!kpiDistribution}
                    onClick={handleToggleOnClick}
                />
            </div>
            {enabled && (
                <div className={styles.content}>
                    <NumberInput
                        placeholder="0%"
                        suffix="%"
                        label={t("apr")}
                        value={apr?.formatted}
                        allowNegative={false}
                        onValueChange={handleAprOnChange}
                        onBlur={handleAprOnBlur}
                    />
                    <div className={styles.summary}>
                        <Typography size="sm" weight="medium" uppercase>
                            {t("preview")}
                        </Typography>
                        <div className={styles.field}>
                            <Typography size="xs" variant="secondary">
                                {t("duration")}
                            </Typography>
                            <Typography size="xs" weight="medium">
                                {startDate
                                    ? dayjs(startDate).to(endDate, true)
                                    : "-"}
                            </Typography>
                        </div>
                        <div className={styles.field}>
                            <Typography size="xs" variant="secondary">
                                {t("totalBudget")}
                            </Typography>
                            <div className={styles.token}>
                                <RemoteLogo
                                    size="xs"
                                    chain={chainId}
                                    address={tokenBudget?.token.address}
                                />
                                <Typography size="xs" weight="medium">
                                    {tokenBudget?.token.symbol}
                                </Typography>
                                <Typography size="xs" weight="medium">
                                    {formatAmount({
                                        amount: tokenBudget?.amount.formatted,
                                    })}
                                </Typography>
                                <Typography
                                    size="xs"
                                    weight="medium"
                                    variant="secondary"
                                >
                                    {formatUsdAmount({
                                        amount: tokenBudget?.amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Typography size="xs" variant="secondary">
                                {t("dailyEmission")}
                            </Typography>
                            <div className={styles.token}>
                                <RemoteLogo
                                    size="xs"
                                    chain={chainId}
                                    address={dailyEmission?.token.address}
                                />
                                <Typography size="xs" weight="medium">
                                    {dailyEmission?.token.symbol}
                                </Typography>
                                <Typography size="xs" weight="medium">
                                    {formatAmount({
                                        amount: dailyEmission?.amount.formatted,
                                    })}
                                </Typography>
                                <Typography
                                    size="xs"
                                    weight="medium"
                                    variant="secondary"
                                >
                                    {formatUsdAmount({
                                        amount: dailyEmission?.amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Typography size="xs" variant="secondary">
                                {t("buffer")}
                            </Typography>
                            <div className={styles.buffer}>
                                <Typography size="xs" weight="medium">
                                    {formatPercentage({
                                        percentage: BUFFER_PERCENTAGE,
                                    })}
                                </Typography>
                                <InfoTooltip>
                                    <Typography size="xs">
                                        {t("bufferTooltip")}
                                    </Typography>
                                </InfoTooltip>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

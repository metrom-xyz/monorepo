import type {
    BaseCampaignPayloadPart,
    CampaignPayloadFixedDistribution,
} from "@/src/types/campaign/common";
import type { NumberFormatValues } from "react-number-format";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InfoTooltip, NumberInput, Popover, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useProtocolFees } from "@/src/hooks/useProtocolFees";
import { useAccount } from "@/src/hooks/useAccount";
import { useRewardTokens } from "@/src/hooks/useRewardTokens";
import { useWatchBalances } from "@/src/hooks/use-watch-balances";
import type {
    UsdPricedErc20TokenAmount,
    WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import { FEE_UNIT } from "@/src/commons";
import type { Dayjs } from "dayjs";
import { getUsdBudgetForFixedApr } from "@/src/utils/form";
import {
    formatAmount,
    formatPercentage,
    formatUnits,
    formatUsdAmount,
    parseUnits,
} from "@/src/utils/format";
import { EmptyState } from "@/src/components/empty-state";
import { MinusSquareIcon } from "@/src/assets/minus-square-icon";
import { PencilIcon } from "@/src/assets/pencil-icon";
import { RemoteLogo } from "@/src/components/remote-logo";
import { BoldText } from "@/src/components/bold-text";
import { ResetIcon } from "@/src/assets/reset-icon";
import dayjs from "dayjs";

import styles from "./styles.module.css";

interface FixedAprPickerProps {
    chainId?: number;
    startDate?: Dayjs;
    endDate?: Dayjs;
    value?: CampaignPayloadFixedDistribution;
    onChange: (specification: BaseCampaignPayloadPart) => void;
}

interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

const MAX_FORMATTED_BUDGET = 10_000_000;
const REFERENCE_TVL = 1_000_000;
const BUFFER_PERCENTAGE = 20;

export function FixedAprPicker({
    chainId,
    startDate,
    endDate,
    value,
    onChange,
}: FixedAprPickerProps) {
    const [tvl, setTvl] = useState<NumberInputValues>({
        raw: REFERENCE_TVL,
        formatted: REFERENCE_TVL.toString(),
    });
    const [resolvedFee, setResolvedFee] = useState<number>();
    const [editingTvl, setEditingTvl] = useState(false);
    const [tvlPopover, setTvlPopover] = useState(false);
    const [tvlPopoverAnchor, setTvlPopoverAnchor] =
        useState<HTMLDivElement | null>(null);

    const tvlPopoverRef = useRef<HTMLDivElement>(null);
    const tvlInputRef = useRef<HTMLInputElement>(null);

    const t = useTranslations("newCampaign.inputs.fixedAprPicker");
    const { fee, feeRebate } = useProtocolFees();
    const { address } = useAccount();
    const { tokens: rewardTokens, loading: loadingRewardTokens } =
        useRewardTokens({ chainId });
    const {
        tokensWithBalance: rewardTokensWithBalance,
        loading: loadingRewardTokensBalances,
    } = useWatchBalances<WhitelistedErc20Token>({
        address,
        tokens: rewardTokens,
    });

    useEffect(() => {
        if (fee !== undefined && feeRebate !== undefined) {
            const resolvedFeeRebate = feeRebate / FEE_UNIT;
            setResolvedFee(fee - fee * resolvedFeeRebate);
        }
    }, [feeRebate, fee]);

    useEffect(() => {
        if (!editingTvl) return;
        tvlInputRef.current?.focus();
    }, [editingTvl]);

    const {
        tokenBudget,
        dailyEmission,
    }: {
        tokenBudget: UsdPricedErc20TokenAmount | null;
        dailyEmission: UsdPricedErc20TokenAmount | null;
    } = useMemo(() => {
        if (
            tvl.raw === undefined ||
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

        const minutesDuration = endDate.diff(startDate, "minutes", false);
        const daysDuration = minutesDuration / (60 * 24);
        const usdBudget = getUsdBudgetForFixedApr(
            tvl.raw,
            BUFFER_PERCENTAGE,
            daysDuration,
            value?.apr,
        );
        const usdBudgetWithoutBuffer = getUsdBudgetForFixedApr(
            tvl.raw,
            0,
            daysDuration,
            value?.apr,
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

        const formattedBudget = Math.min(
            (usdBudget * FEE_UNIT) /
                (FEE_UNIT - resolvedFee) /
                rewardToken.usdPrice,
            MAX_FORMATTED_BUDGET,
        );

        const rawBudget = parseUnits(
            formattedBudget.toFixed(),
            rewardToken.decimals,
        );

        const formattedBudgetWithoutBuffer = Math.min(
            usdBudgetWithoutBuffer / rewardToken.usdPrice,
            MAX_FORMATTED_BUDGET,
        );
        const rawBudgetWithoutBuffer = parseUnits(
            formattedBudgetWithoutBuffer.toFixed(),
            rewardToken.decimals,
        );

        const rawPerMinuteEmission =
            rawBudgetWithoutBuffer / BigInt(Math.ceil(minutesDuration));
        const rawDailyEmission = rawPerMinuteEmission * BigInt(60 * 24);
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
        tvl,
        resolvedFee,
        rewardTokens,
        rewardTokensWithBalance,
        loadingRewardTokens,
        loadingRewardTokensBalances,
        value?.apr,
        startDate,
        endDate,
        address,
    ]);

    const handleAprOnChange = useCallback(
        ({ floatValue }: NumberFormatValues) => {
            if (floatValue === undefined) {
                onChange({ fixedDistribution: undefined });
                return;
            }
            onChange({ fixedDistribution: { apr: floatValue } });
        },
        [onChange],
    );

    const handleAprOnReset = useCallback(() => {
        onChange({ fixedDistribution: undefined });
    }, [onChange]);

    function handleTvlPopoverOpen() {
        setTvlPopover(true);
    }

    function handleTvlPopoverClose() {
        setTvlPopover(false);
    }

    function handleTvlOnClicK() {
        setEditingTvl(true);
    }

    function handleTvlOnChange(value: NumberFormatValues) {
        setTvl({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    const handleTvlOnBlur = useCallback(() => {
        setEditingTvl(false);
        setTvlPopover(false);
        if (!tokenBudget) return;
    }, [tokenBudget]);

    return (
        <div className={styles.root}>
            <div className={styles.aprInputWrapper}>
                <div>
                    <NumberInput
                        placeholder="0%"
                        suffix="%"
                        label={t("apr")}
                        border={false}
                        value={value?.apr || ""}
                        allowNegative={false}
                        onValueChange={handleAprOnChange}
                        className={styles.aprInput}
                    />
                    <div className={styles.reset} onClick={handleAprOnReset}>
                        <ResetIcon />
                        <Typography size="xs" weight="medium">
                            {t("reset")}
                        </Typography>
                    </div>
                </div>
                <Typography size="xs" variant="tertiary">
                    {t("aprInputDescription")}
                </Typography>
            </div>
            <div className={styles.previewWrapper}>
                <div className={styles.titleContainer}>
                    <Typography size="sm" weight="medium" uppercase>
                        {t("preview")}
                    </Typography>
                    <Popover
                        ref={tvlPopoverRef}
                        open={tvlPopover && !editingTvl}
                        anchor={tvlPopoverAnchor}
                        placement="top"
                        onOpenChange={setTvlPopover}
                        margin={6}
                        className={styles.popover}
                    >
                        <Typography size="xs">{t("editTvl")}</Typography>
                    </Popover>
                    {editingTvl ? (
                        <>
                            <NumberInput
                                ref={tvlInputRef}
                                size="xs"
                                suffix="$"
                                value={tvl?.formatted}
                                allowNegative={false}
                                onValueChange={handleTvlOnChange}
                                onBlur={handleTvlOnBlur}
                                className={styles.tvlInput}
                            />
                            <Typography size="sm" weight="medium">
                                {t("tvl")}
                            </Typography>
                        </>
                    ) : (
                        <div
                            ref={setTvlPopoverAnchor}
                            onClick={handleTvlOnClicK}
                            onMouseEnter={handleTvlPopoverOpen}
                            onMouseLeave={handleTvlPopoverClose}
                            className={styles.tvlChip}
                        >
                            <Typography size="sm" weight="medium" uppercase>
                                {t("tvlAmount", {
                                    amount: formatUsdAmount({
                                        amount: tvl?.raw,
                                    }),
                                })}
                            </Typography>
                            <PencilIcon className={styles.editIcon} />
                        </div>
                    )}
                </div>
                {value?.apr ? (
                    <div className={styles.previewContent}>
                        <div className={styles.budget}>
                            <div className={styles.token}>
                                <RemoteLogo
                                    size="xs"
                                    chain={chainId}
                                    address={tokenBudget?.token.address}
                                />
                                <Typography size="lg" weight="medium">
                                    {tokenBudget?.token.symbol}
                                </Typography>
                                <Typography size="lg" weight="medium">
                                    {formatAmount({
                                        amount: tokenBudget?.amount.formatted,
                                    })}
                                </Typography>
                            </div>
                            <Typography size="xs" variant="tertiary">
                                {t.rich("totalBudget", {
                                    usdBudget: formatUsdAmount({
                                        amount: tokenBudget?.amount.usdValue,
                                    }),
                                    apr: formatPercentage({
                                        percentage: value?.apr,
                                    }),
                                    bold: (chunks) => (
                                        <BoldText>{chunks}</BoldText>
                                    ),
                                })}
                            </Typography>
                        </div>
                        <div className={styles.emissions}>
                            <div className={styles.transparentBox}>
                                <Typography size="xs" variant="tertiary">
                                    {t("dailyEmission")}
                                </Typography>
                                <div className={styles.dailyEmissionToken}>
                                    <RemoteLogo
                                        size="xxs"
                                        chain={chainId}
                                        address={tokenBudget?.token.address}
                                    />
                                    <Typography size="xs" weight="medium">
                                        {tokenBudget?.token.symbol}{" "}
                                        {formatAmount({
                                            amount: dailyEmission?.amount
                                                .formatted,
                                        })}
                                    </Typography>
                                    <Typography size="xs" variant="tertiary">
                                        {formatUsdAmount({
                                            amount: dailyEmission?.amount
                                                .usdValue,
                                        })}
                                    </Typography>
                                </div>
                            </div>
                            <div>
                                <div className={styles.transparentBox}>
                                    <Typography size="xs" variant="tertiary">
                                        {t("duration")}
                                    </Typography>
                                    <Typography size="xs" weight="medium">
                                        {startDate
                                            ? dayjs(startDate).to(endDate, true)
                                            : "-"}
                                    </Typography>
                                </div>
                                <div className={styles.transparentBox}>
                                    <Typography size="xs" variant="tertiary">
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
                    </div>
                ) : (
                    <EmptyState
                        icon={MinusSquareIcon}
                        title={t("noPreview")}
                        subtitle={t("noPreviewDescription")}
                        className={styles.empty}
                    />
                )}
            </div>
        </div>
    );
}

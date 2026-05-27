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
import {
    getUsdBudgetForFixedApr,
    getRawUsdBudgetForFixedApr,
} from "@/src/utils/fixed-apr";
import {
    formatAmount,
    formatPercentage,
    formatUnits,
    formatUsdAmount,
} from "@/src/utils/format";
import { PencilIcon } from "@/src/assets/pencil-icon";
import { RemoteLogo } from "@/src/components/remote-logo";
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

const REFERENCE_TVL = 1_000_000;
const BUFFER_PERCENTAGE = 20;
const MAX_APR_VALUE = 100_000;
const MAX_TVL_VALUE = REFERENCE_TVL * 500;

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
    const { fee, feeRebate } = useProtocolFees({ chainId });
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
            rewardTokensWithBalance.length === 0 ||
            loadingRewardTokens ||
            loadingRewardTokensBalances
        )
            return {
                tokenBudget: null,
                dailyEmission: null,
            };

        const minutes = endDate.diff(startDate, "minutes", false);
        const days = minutes / (60 * 24);
        const minutesRaw = BigInt(Math.ceil(minutes));

        const rawUsdBudget = getRawUsdBudgetForFixedApr(
            tvl.raw,
            BigInt(Math.round(BUFFER_PERCENTAGE * 100)),
            minutesRaw,
            BigInt(Math.round((value?.apr ?? 0) * 100)),
        );
        const usdBudget = getUsdBudgetForFixedApr(
            tvl.raw,
            BUFFER_PERCENTAGE,
            days,
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

        const rawUsdBudgetWithFee =
            (rawUsdBudget * BigInt(FEE_UNIT)) / BigInt(FEE_UNIT - resolvedFee);

        const usdPrice = BigInt(Math.round(rewardToken.usdPrice * 1_000_000));
        const decimalsScale = BigInt(10 ** rewardToken.decimals);

        const rawTokenBudget = (rawUsdBudgetWithFee * decimalsScale) / usdPrice;
        const rawTokenBudgetWithoutBuffer =
            (rawUsdBudget * decimalsScale) / usdPrice;

        const rawPerMinuteEmission = rawTokenBudgetWithoutBuffer / minutesRaw;
        const rawDailyEmission = rawPerMinuteEmission * 24n * 60n;

        return {
            tokenBudget: {
                token: rewardToken,
                amount: {
                    raw: rawTokenBudget,
                    formatted: Number(
                        formatUnits(rawTokenBudget, rewardToken.decimals),
                    ),
                    usdValue: Number(formatUnits(rawUsdBudgetWithFee, 6)),
                },
            },
            dailyEmission: {
                token: rewardToken,
                amount: {
                    raw: rawDailyEmission,
                    formatted: Number(
                        formatUnits(rawDailyEmission, rewardToken.decimals),
                    ),
                    usdValue: Number(
                        formatUnits(
                            (rawDailyEmission * usdPrice) / decimalsScale,
                            6,
                        ),
                    ),
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
            <div className="h-full">
                <NumberInput
                    size="lg"
                    placeholder="0%"
                    suffix="%"
                    label={t("apr")}
                    value={value?.apr || ""}
                    allowNegative={false}
                    isAllowed={({ floatValue }) => {
                        if (!floatValue) return true;
                        return floatValue <= MAX_APR_VALUE;
                    }}
                    onValueChange={handleAprOnChange}
                    className={styles.aprInput}
                />
            </div>
            {value?.apr ? (
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
                                    isAllowed={({ floatValue }) => {
                                        if (!floatValue) return true;
                                        return floatValue <= MAX_TVL_VALUE;
                                    }}
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
                    <div className={styles.previewContent}>
                        <div className={styles.budget}>
                            <Typography size="xs" variant="tertiary">
                                {t("totRewards")}
                            </Typography>
                            <div className={styles.token}>
                                <RemoteLogo
                                    size="xxs"
                                    chain={chainId}
                                    address={tokenBudget?.token.address}
                                />
                                <Typography size="xs" weight="medium">
                                    {formatAmount({
                                        amount: tokenBudget?.amount.formatted,
                                    })}
                                </Typography>
                                <Typography size="xs" weight="medium">
                                    {tokenBudget?.token.symbol}
                                </Typography>
                                <Typography size="xs" variant="tertiary">
                                    {formatUsdAmount({
                                        amount: tokenBudget?.amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.transparentBox}>
                            <Typography size="xs" variant="tertiary">
                                {t("daily")}
                            </Typography>
                            <div className={styles.dailyEmissionToken}>
                                <RemoteLogo
                                    size="xxs"
                                    chain={chainId}
                                    address={tokenBudget?.token.address}
                                />
                                <Typography size="xs" weight="medium">
                                    {formatAmount({
                                        amount: dailyEmission?.amount.formatted,
                                    })}
                                </Typography>
                                <Typography size="xs" weight="medium">
                                    {tokenBudget?.token.symbol}
                                </Typography>
                                <Typography size="xs" variant="tertiary">
                                    {formatUsdAmount({
                                        amount: dailyEmission?.amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.transparentBox}>
                            <Typography size="xs" variant="tertiary">
                                {t("duration")}
                            </Typography>
                            <Typography size="xs" weight="medium">
                                {startDate
                                    ? dayjs(startDate.toDate()).to(
                                          endDate,
                                          true,
                                      )
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
            ) : (
                <Typography
                    size="xs"
                    variant="tertiary"
                    uppercase
                    className={styles.emptyText}
                >
                    {t("noPreviewDescription")}
                </Typography>
            )}
        </div>
    );
}

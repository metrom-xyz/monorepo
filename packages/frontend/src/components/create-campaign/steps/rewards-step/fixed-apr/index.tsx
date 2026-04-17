import { useTranslations } from "next-intl";
import {
    InfoTooltip,
    NumberInput,
    Popover,
    Toggle,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import classNames from "classnames";
import { PencilIcon } from "@/src/assets/pencil-icon";

import styles from "./styles.module.css";
import type {
    BaseCampaignPayloadPart,
    CampaignPayloadFixedDistribution,
    CampaignPayloadKpiDistribution,
} from "@/src/types/campaign/common";

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
    const [tvl, setTvl] = useState<NumberInputValues>({
        raw: REFERENCE_TVL,
        formatted: REFERENCE_TVL.toString(),
    });
    const [enabled, setEnabled] = useState<boolean>(false);
    const [resolvedFee, setResolvedFee] = useState<number>();
    const [editingTvl, setEditingTvl] = useState(false);
    const [tvlPopover, setTvlPopover] = useState(false);
    const [tvlPopoverAnchor, setTvlPopoverAnchor] =
        useState<HTMLDivElement | null>(null);

    const tvlPopoverRef = useRef<HTMLDivElement>(null);
    const tvlInputRef = useRef<HTMLInputElement>(null);

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
            apr?.raw,
        );
        const usdBudgetWithoutBuffer = getUsdBudgetForFixedApr(
            tvl.raw,
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
        apr?.raw,
        startDate,
        endDate,
        address,
    ]);

    const handleToggleOnClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (enabled) {
                setApr(undefined);
                setTvl({
                    formatted: REFERENCE_TVL.toString(),
                    raw: REFERENCE_TVL,
                });
                onFixedAprChange({
                    fixedDistribution: undefined,
                });
            } else if (tokenBudget)
                onFixedAprChange({ fixedDistribution: {} }, tokenBudget);

            event.stopPropagation();
            setEditingTvl(false);
            setTvlPopover(false);
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

    const updateFixedAprDistribution = useCallback(() => {
        setEditingTvl(false);
        setTvlPopover(false);
        if (!tokenBudget) return;
        onFixedAprChange({ fixedDistribution: { apr: apr?.raw } }, tokenBudget);
    }, [tokenBudget, apr, onFixedAprChange]);

    return (
        <div className={classNames(styles.root, { [styles.enabled]: enabled })}>
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <Typography size="sm" weight="medium">
                        {t("title")}
                    </Typography>
                    <Typography size="xs" variant="tertiary">
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
                <div
                    className={classNames(styles.content, {
                        [styles.enabled]: enabled,
                    })}
                >
                    <NumberInput
                        placeholder="0%"
                        suffix="%"
                        label={t("apr")}
                        value={apr?.formatted}
                        allowNegative={false}
                        onValueChange={handleAprOnChange}
                        onBlur={updateFixedAprDistribution}
                    />
                    <div className={styles.summary}>
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
                                <Typography size="xs">
                                    {t("editTvl")}
                                </Typography>
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
                                        onBlur={updateFixedAprDistribution}
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
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        uppercase
                                    >
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
                        <div className={styles.field}>
                            <Typography size="xs" weight="medium">
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
                                    variant="tertiary"
                                >
                                    {formatUsdAmount({
                                        amount: tokenBudget?.amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Typography size="xs" variant="tertiary">
                                {t("duration")}
                            </Typography>
                            <Typography size="xs" weight="medium">
                                {startDate
                                    ? dayjs(startDate).to(endDate, true)
                                    : "-"}
                            </Typography>
                        </div>
                        <div className={styles.field}>
                            <Typography size="xs" variant="tertiary">
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
                                    variant="tertiary"
                                >
                                    {formatUsdAmount({
                                        amount: dailyEmission?.amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.field}>
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
            )}
        </div>
    );
}

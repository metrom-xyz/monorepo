import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import {
    Button,
    ErrorText,
    Skeleton,
    Switch,
    SwitchOption,
    Toggle,
    Typography,
} from "@metrom-xyz/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useTranslations } from "next-intl";
import { RangeInputs } from "./range-inputs";
import { LiquidityDensityChart } from "@/src/components/liquidity-density-chart";
import { DistributablesType, tickToScaledPrice } from "@metrom-xyz/sdk";
import { usePrevious } from "react-use";
import { useLiquidityDensity } from "@/src/hooks/useLiquidityDensity";
import { formatAmount } from "@/src/utils/format";
import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
    AugmentedPriceRangeBound,
    AugmentedPriceRangeSpecification,
    CampaignPayloadErrors,
} from "@/src/types/campaign/common";
import type { LocalizedMessage } from "@/src/types/utils";

import styles from "./styles.module.css";

const COMPUTE_TICKS_AMOUNT = 3000;
const RANGE_TICKS_LIMIT = 4000;

interface RangeStepProps {
    disabled?: boolean;
    distributablesType?: DistributablesType;
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    priceRangeSpecification?: AmmPoolLiquidityCampaignPayload["priceRangeSpecification"];
    onRangeChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.ammPoolLiquidity.range">;

export function RangeStep({
    disabled,
    distributablesType,
    pool,
    priceRangeSpecification,
    onRangeChange,
    onError,
}: RangeStepProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.range");
    const [open, setOpen] = useState(false);
    const [token0To1, setToken0To1] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [error, setError] = useState<ErrorMessage>("");
    const [warning, setWarning] = useState<ErrorMessage>("");

    const [from, setFrom] = useState<AugmentedPriceRangeBound | undefined>(
        priceRangeSpecification?.from,
    );
    const [to, setTo] = useState<AugmentedPriceRangeBound | undefined>(
        priceRangeSpecification?.to,
    );

    const prevRangeSpecification = usePrevious(priceRangeSpecification);
    const { id: chainId } = useChainWithType();
    const { liquidityDensity, loading: loadingLiquidityDensity } =
        useLiquidityDensity({
            pool,
            computeAmount: COMPUTE_TICKS_AMOUNT,
            enabled,
        });

    const unsavedChanges = useMemo(() => {
        return (
            !prevRangeSpecification ||
            prevRangeSpecification.from !== from ||
            prevRangeSpecification.to !== to
        );
    }, [from, prevRangeSpecification, to]);

    const currentPrice = useMemo(() => {
        if (!liquidityDensity || !pool) return undefined;
        const activeTickIdx = token0To1
            ? liquidityDensity.activeIdx
            : -liquidityDensity.activeIdx;
        return tickToScaledPrice(activeTickIdx, pool, token0To1);
    }, [liquidityDensity, token0To1, pool]);

    useEffect(() => {
        setFrom(undefined);
        setTo(undefined);
    }, [pool?.id]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    // this hooks is used to disable and close the step when
    // the range specification gets disabled, after the campaign creation
    useEffect(() => {
        if (enabled && !!prevRangeSpecification && !priceRangeSpecification)
            setEnabled(false);
    }, [enabled, prevRangeSpecification, priceRangeSpecification]);

    // reset state once the step gets disabled
    useEffect(() => {
        if (enabled) return;
        if (priceRangeSpecification)
            onRangeChange({ priceRangeSpecification: undefined });

        setFrom(undefined);
        setTo(undefined);
        setError("");
    }, [enabled, onRangeChange, priceRangeSpecification]);

    useEffect(() => {
        if (!from && !to) setError("");
        else if ((!from && to) || (!to && from)) setError("errors.missing");
        else if (!!from && !!to && from.tick >= to.tick)
            setError("errors.malformed");
        else if (
            !!from &&
            !!to &&
            Math.abs(to.tick - from.tick) > RANGE_TICKS_LIMIT
        )
            setError("errors.rangeTooWide");
        else setError("");
    }, [from, to]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    useEffect(() => {
        if (enabled && !open && unsavedChanges)
            setWarning("warnings.notApplied");
        else setWarning("");
    }, [enabled, open, unsavedChanges]);

    useEffect(() => {
        onError({
            priceRangeSpecification:
                !!error || (enabled && !priceRangeSpecification),
        });
    }, [error, enabled, priceRangeSpecification, onError]);

    // TODO: avoid resetting when the range is enabled for points.
    // This hook is used to reset and disable the range when changing reward type.
    useEffect(() => {
        onRangeChange({ priceRangeSpecification: undefined });
        setFrom(undefined);
        setTo(undefined);
        setEnabled(false);
        setError("");
    }, [distributablesType, onRangeChange]);

    function handleToggleOnClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        setOpen((open) => !open);
    }

    const handleOnFlipPrice = useCallback(() => {
        if (!pool) return;

        setToken0To1((token0To1) => {
            const newToken0ToToken1 = !token0To1;

            if (from && to) {
                const newFromTick = -to.tick;
                const newFromPrice = tickToScaledPrice(
                    newFromTick,
                    pool,
                    newToken0ToToken1,
                );
                setFrom({ tick: newFromTick, price: newFromPrice });

                const newToTick = -from.tick;
                const newToPrice = tickToScaledPrice(
                    newToTick,
                    pool,
                    newToken0ToToken1,
                );
                setTo({ tick: newToTick, price: newToPrice });
            }

            return newToken0ToToken1;
        });
    }, [pool, from, to]);

    const handleApply = useCallback(() => {
        if (from === undefined || to === undefined) return;

        const priceRangeSpecification: AugmentedPriceRangeSpecification = {
            token0To1,
            from,
            to,
        };

        setOpen(false);
        onRangeChange({ priceRangeSpecification });
    }, [from, onRangeChange, to, token0To1]);

    return (
        <Step
            disabled={disabled}
            completed={enabled}
            open={open}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <div className={styles.previewTextWrapper}>
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("title")}
                            </Typography>
                            <ErrorText
                                size="xs"
                                weight="medium"
                                level={error ? "error" : "warning"}
                            >
                                {error ? t(error) : warning ? t(warning) : null}
                            </ErrorText>
                        </div>
                        <Toggle
                            tabIndex={-1}
                            size="lg"
                            checked={enabled}
                            onClick={handleToggleOnClick}
                        />
                    </div>
                }
                decorator={false}
                disabled={!enabled}
            >
                <div className={styles.priceWrapper}>
                    {open || from === undefined || to === undefined ? (
                        <>
                            <Typography
                                uppercase
                                weight="medium"
                                variant="tertiary"
                                size="sm"
                            >
                                {t("currentPrice")}
                            </Typography>
                            {!currentPrice || !pool ? (
                                <Skeleton size="sm" width={50} />
                            ) : (
                                <Typography weight="medium" size="sm">
                                    {t("price", {
                                        token0: pool.tokens[token0To1 ? 0 : 1]
                                            .symbol,
                                        token1: pool.tokens[token0To1 ? 1 : 0]
                                            .symbol,
                                        price: formatAmount({
                                            amount: currentPrice,
                                        }),
                                    })}
                                </Typography>
                            )}
                        </>
                    ) : (
                        <>
                            <Typography
                                uppercase
                                weight="medium"
                                variant="tertiary"
                                size="sm"
                            >
                                {t("range.label")}
                            </Typography>
                            <Typography weight="medium" size="sm">
                                {t("range.value", {
                                    token0:
                                        pool?.tokens[token0To1 ? 0 : 1]
                                            .symbol || "",
                                    token1:
                                        pool?.tokens[token0To1 ? 1 : 0]
                                            .symbol || "",
                                    lowerPrice: from.price.toFixed(4),
                                    upperPrice: to.price.toFixed(4),
                                })}
                            </Typography>
                        </>
                    )}
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <div className={styles.flipPriceWrapper}>
                        <Switch value={token0To1} onChange={handleOnFlipPrice}>
                            <SwitchOption value={true}>
                                <Typography size="sm" weight="medium">
                                    {pool?.tokens[0].symbol}
                                </Typography>
                            </SwitchOption>
                            <SwitchOption value={false}>
                                <Typography size="sm" weight="medium">
                                    {pool?.tokens[1].symbol}
                                </Typography>
                            </SwitchOption>
                        </Switch>
                    </div>
                    <RangeInputs
                        pool={pool}
                        error={!!error}
                        currentPrice={currentPrice}
                        token0To1={token0To1}
                        from={from}
                        to={to}
                        onFromChange={setFrom}
                        onToChange={setTo}
                    />
                    <div>
                        <Typography
                            weight="medium"
                            variant="tertiary"
                            uppercase
                            size="xs"
                        >
                            {t("chart")}
                        </Typography>
                        <LiquidityDensityChart
                            tooltipSize="xs"
                            header
                            token0To1={token0To1}
                            error={!!error}
                            loading={loadingLiquidityDensity}
                            from={{ tick: from?.tick }}
                            to={{ tick: to?.tick }}
                            pool={pool}
                            density={liquidityDensity}
                            className={styles.liquidityDensityChart}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={
                            !unsavedChanges ||
                            to === undefined ||
                            from === undefined ||
                            !!error
                        }
                        onClick={handleApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}

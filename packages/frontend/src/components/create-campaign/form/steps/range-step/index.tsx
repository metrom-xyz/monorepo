import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import {
    Button,
    ErrorText,
    Skeleton,
    Switch,
    Tab,
    Tabs,
    Typography,
} from "@metrom-xyz/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { RangeInputs } from "./range-inputs";
import { LiquidityDensityChart } from "@/src/components/liquidity-density-chart";
import {
    tickToScaledPrice,
    type AmmPool,
    type AmmPoolLiquidityTarget,
} from "@metrom-xyz/sdk";
import classNames from "classnames";
import { usePrevious } from "react-use";
import { useLiquidityDensity } from "@/src/hooks/useLiquidityDensity";
import { formatAmount } from "@/src/utils/format";
import type {
    AugmentedPriceRangeBound,
    AugmentedPriceRangeSpecification,
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";

import styles from "./styles.module.css";

const COMPUTE_TICKS_AMOUNT = 3000;

interface RangeStepProps {
    disabled?: boolean;
    target?: AmmPoolLiquidityTarget;
    priceRangeSpecification?: CampaignPayload["priceRangeSpecification"];
    onRangeChange: (range: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function RangeStep({
    disabled,
    target,
    priceRangeSpecification,
    onRangeChange,
    onError,
}: RangeStepProps) {
    const t = useTranslations("newCampaign.form.range");
    const [open, setOpen] = useState(false);
    const [token0To1, setToken0To1] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");

    const [from, setFrom] = useState<AugmentedPriceRangeBound | undefined>(
        priceRangeSpecification?.from,
    );
    const [to, setTo] = useState<AugmentedPriceRangeBound | undefined>(
        priceRangeSpecification?.to,
    );

    const prevRangeSpecification = usePrevious(priceRangeSpecification);
    const chainId = useChainId();
    const { liquidityDensity, loading: loadingLiquidityDensity } =
        useLiquidityDensity(target?.pool, COMPUTE_TICKS_AMOUNT);

    const unsavedChanges = useMemo(() => {
        return (
            !prevRangeSpecification ||
            prevRangeSpecification.from !== from ||
            prevRangeSpecification.to !== to
        );
    }, [from, prevRangeSpecification, to]);

    const currentPrice = useMemo(() => {
        if (!liquidityDensity || !target?.pool) return undefined;
        const activeTickIdx = token0To1
            ? liquidityDensity.activeIdx
            : -liquidityDensity.activeIdx;
        return tickToScaledPrice(activeTickIdx, target.pool, token0To1);
    }, [liquidityDensity, token0To1, target?.pool]);

    useEffect(() => {
        setFrom(undefined);
        setTo(undefined);
    }, [target?.pool.address]);

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

    function handleSwitchOnClick() {
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        setOpen((open) => !open);
    }

    const handleOnFlipPrice = useCallback(() => {
        if (!target) return;

        setToken0To1((token0To1) => {
            const newToken0ToToken1 = !token0To1;

            if (from && to) {
                const newFromTick = -to.tick;
                const newFromPrice = tickToScaledPrice(
                    newFromTick,
                    target.pool,
                    newToken0ToToken1,
                );
                setFrom({ tick: newFromTick, price: newFromPrice });

                const newToTick = -from.tick;
                const newToPrice = tickToScaledPrice(
                    newToTick,
                    target.pool,
                    newToken0ToToken1,
                );
                setTo({ tick: newToTick, price: newToPrice });
            }

            return newToken0ToToken1;
        });
    }, [from, target, to]);

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
            error={!!error || !!warning}
            errorLevel={!!error ? "error" : "warning"}
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
                                level={!!error ? "error" : "warning"}
                                className={classNames(styles.error, {
                                    [styles.errorVisible]: !!error || !!warning,
                                })}
                            >
                                {!!error
                                    ? t(error)
                                    : !!warning
                                      ? t(warning)
                                      : null}
                            </ErrorText>
                        </div>
                        <Switch
                            tabIndex={-1}
                            size="lg"
                            checked={enabled}
                            onClick={handleSwitchOnClick}
                        />
                    </div>
                }
                decorator={false}
                className={{
                    root: classNames({
                        [styles.previewDisabled]: !enabled,
                    }),
                }}
            >
                <div className={styles.priceWrapper}>
                    {open || from === undefined || to === undefined ? (
                        <>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                size="sm"
                            >
                                {t("currentPrice")}
                            </Typography>
                            {!currentPrice ? (
                                <Skeleton size="sm" width={50} />
                            ) : (
                                <Typography weight="medium" size="sm">
                                    {t("price", {
                                        token0: target?.pool.tokens[
                                            token0To1 ? 0 : 1
                                        ].symbol,
                                        token1: target?.pool.tokens[
                                            token0To1 ? 1 : 0
                                        ].symbol,
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
                                light
                                size="sm"
                            >
                                {t("range.label")}
                            </Typography>
                            <Typography weight="medium" size="sm">
                                {t("range.value", {
                                    token0: target?.pool.tokens[
                                        token0To1 ? 0 : 1
                                    ].symbol,
                                    token1: target?.pool.tokens[
                                        token0To1 ? 1 : 0
                                    ].symbol,
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
                    <Tabs
                        size="sm"
                        value={token0To1}
                        onChange={handleOnFlipPrice}
                        className={styles.priceTabs}
                    >
                        <Tab
                            value={token0To1}
                            className={classNames(styles.priceTab, {
                                [styles.activePriceTab]: token0To1,
                            })}
                        >
                            <Typography weight="medium" size="sm">
                                {target?.pool.tokens[0].symbol}
                            </Typography>
                        </Tab>
                        <Tab
                            value={!token0To1}
                            className={classNames(styles.priceTab, {
                                [styles.activePriceTab]: !token0To1,
                            })}
                        >
                            <Typography weight="medium" size="sm">
                                {target?.pool.tokens[1].symbol}
                            </Typography>
                        </Tab>
                    </Tabs>
                    <RangeInputs
                        pool={target?.pool}
                        error={!!error}
                        currentPrice={currentPrice}
                        token0To1={token0To1}
                        from={from}
                        to={to}
                        onFromChange={setFrom}
                        onToChange={setTo}
                    />
                    <div>
                        <Typography weight="medium" light uppercase size="xs">
                            {t("chart")}
                        </Typography>
                        <LiquidityDensityChart
                            header
                            token0To1={token0To1}
                            error={!!error}
                            loading={loadingLiquidityDensity}
                            from={from?.tick}
                            to={to?.tick}
                            pool={target?.pool}
                            density={liquidityDensity}
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

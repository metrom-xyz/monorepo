import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormSteps } from "@/src/context/form-steps";
import type {
    AmmPoolLiquidityCampaignPayload,
    AugmentedPriceRangeBound,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { PoolRangePicker } from "../../inputs/pool-range-picker";
import { useLiquidityDensity } from "@/src/hooks/useLiquidityDensity";
import { DistributablesType, tickToScaledPrice } from "@metrom-xyz/sdk";
import { FormStepSection } from "../../form-step-section";
import { Button, Switch, SwitchOption, Typography } from "@metrom-xyz/ui";
import { FormStep } from "../../form-step";
import { rangesEqual, rangeSpecificationCompleted } from "@/src/utils/form";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { formatAmount } from "@/src/utils/format";
import { LiquidityDensityChart } from "@/src/components/liquidity-density-chart";
import { RemoteLogo } from "@/src/components/remote-logo";
import classNames from "classnames";
import { usePrevious } from "react-use";
import { FormStepId } from "@/src/types/form";

import styles from "./styles.module.css";

const COMPUTE_TICKS_AMOUNT = 3000;

interface CampaignPoolRangeStepProps {
    payload: AmmPoolLiquidityCampaignPayload;
    disabled?: boolean;
    onApply: (
        payload: AmmPoolLiquidityCampaignPayload,
        stepId: FormStepId,
    ) => void;
}

export function CampaignPoolRangeStep({
    payload,
    disabled,
    onApply,
}: CampaignPoolRangeStepProps) {
    const [open, setOpen] = useState(false);
    const [applied, setApplied] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const [rangePayload, setRangePayload] = useState({
        priceRangeSpecification: payload.priceRangeSpecification || {
            token0To1: true,
            from: undefined,
            to: undefined,
        },
    });

    const token0To1 = rangePayload.priceRangeSpecification?.token0To1 ?? true;

    const t = useTranslations("newCampaign.form.range");
    const { errors, activeStepId, updateErrors, updateUnsaved } =
        useFormSteps();
    const prevPoolId = usePrevious(payload.pool?.id);

    const { liquidityDensity, loading: loadingLiquidityDensity } =
        useLiquidityDensity({
            pool: payload.pool,
            computeAmount: COMPUTE_TICKS_AMOUNT,
            enabled: !disabled && open,
        });

    const currentPrice = useMemo(() => {
        if (!liquidityDensity || !payload.pool) return undefined;
        const activeTickIdx = token0To1
            ? liquidityDensity.activeIdx
            : -liquidityDensity.activeIdx;
        return tickToScaledPrice(activeTickIdx, payload.pool, token0To1);
    }, [liquidityDensity, token0To1, payload.pool]);

    const unsavedChanges = useMemo(() => {
        if (
            !rangeSpecificationCompleted(rangePayload) &&
            !rangePayload.priceRangeSpecification &&
            rangeSpecificationCompleted(payload) &&
            !!payload.priceRangeSpecification
        )
            return true;

        return !rangesEqual(payload, rangePayload);
    }, [payload, rangePayload]);

    const applyDisabled =
        !!errors.range ||
        !unsavedChanges ||
        !rangeSpecificationCompleted(rangePayload);

    const completed =
        !errors.range &&
        !unsavedChanges &&
        rangeSpecificationCompleted(rangePayload);

    useEffect(() => {
        if (applied || completed) return;
        setOpen(activeStepId === FormStepId.PoolRange);
    }, [applied, completed, activeStepId]);

    useEffect(() => {
        updateUnsaved({ range: unsavedChanges });
    }, [unsavedChanges, updateUnsaved]);

    useEffect(() => {
        if (completed || disabled) return;
        if (errors.range || unsavedChanges) {
            setOpen(true);
            return;
        }
    }, [completed, disabled, unsavedChanges, errors.range]);

    useEffect(() => {
        if (!prevPoolId || prevPoolId === payload.pool?.id) return;
        if (!rangePayload.priceRangeSpecification?.from) return;

        setRangePayload({
            priceRangeSpecification: {
                token0To1: true,
                from: undefined,
                to: undefined,
            },
        });
        updateErrors({ range: t("errors.poolChanged") });
    }, [
        payload.pool?.id,
        prevPoolId,
        rangePayload.priceRangeSpecification?.from,
        updateErrors,
        t,
    ]);

    const token0 = payload.pool?.tokens[token0To1 ? 0 : 1];
    const token1 = payload.pool?.tokens[token0To1 ? 1 : 0];

    function handleFromOnChange(value?: AugmentedPriceRangeBound) {
        setRangePayload((prev) => ({
            priceRangeSpecification: {
                ...prev.priceRangeSpecification,
                from: value,
            },
        }));
    }

    function handleToOnChange(value?: AugmentedPriceRangeBound) {
        setRangePayload((prev) => ({
            priceRangeSpecification: {
                ...prev.priceRangeSpecification,
                to: value,
            },
        }));
    }

    const handleOnFlipPrice = useCallback(() => {
        if (!payload.pool) return;

        const newToken0ToToken1 = !token0To1;
        let newFrom: AugmentedPriceRangeBound | undefined = undefined;
        let newTo: AugmentedPriceRangeBound | undefined = undefined;

        if (
            rangePayload.priceRangeSpecification?.from &&
            rangePayload.priceRangeSpecification.to
        ) {
            const { from, to } = rangePayload.priceRangeSpecification;

            const newFromTick = -to.tick;
            const newFromPrice = tickToScaledPrice(
                newFromTick,
                payload.pool,
                newToken0ToToken1,
            );
            newFrom = { tick: newFromTick, price: newFromPrice };

            const newToTick = -from.tick;
            const newToPrice = tickToScaledPrice(
                newToTick,
                payload.pool,
                newToken0ToToken1,
            );
            newTo = { tick: newToTick, price: newToPrice };
        }

        setRangePayload({
            priceRangeSpecification: {
                token0To1: newToken0ToToken1,
                from: newFrom,
                to: newTo,
            },
        });
    }, [payload.pool, rangePayload, token0To1]);

    const handleOnSkip = useCallback(() => {
        onApply({ priceRangeSpecification: undefined }, FormStepId.PoolRange);
        setApplied(true);
        setSkipped(true);
        setRangePayload({
            priceRangeSpecification: {
                token0To1: true,
                from: undefined,
                to: undefined,
            },
        });
        setOpen(false);
        updateErrors({ range: "" });
    }, [onApply, updateErrors]);

    const handleOnApply = useCallback(() => {
        setApplied(true);
        setSkipped(false);
        onApply(rangePayload, FormStepId.PoolRange);
        setOpen(false);
    }, [rangePayload, onApply]);

    if (payload.distributables?.type !== DistributablesType.Tokens) return null;

    return (
        <FormStep
            title={t("title")}
            optional
            skipped={skipped}
            open={open}
            disabled={disabled}
            completed={completed}
            error={errors.range}
            warning={
                !errors.range && !open && unsavedChanges
                    ? t("notSaved")
                    : undefined
            }
            onToggle={setOpen}
            className={styles.root}
        >
            <FormStepSection
                title={t("setRange", {
                    token0: token0?.symbol || "",
                    token1: token1?.symbol || "",
                })}
                headerDecorator={
                    <div className={styles.priceChip}>
                        <Typography size="xs" weight="medium">
                            {t("price", {
                                price: formatAmount({ amount: currentPrice }),
                                token0: token0?.symbol || "",
                                token1: token1?.symbol || "",
                            })}
                        </Typography>
                    </div>
                }
            >
                <div className={styles.inputs}>
                    <Switch
                        value={token0To1}
                        onChange={handleOnFlipPrice}
                        className={styles.switch}
                    >
                        <SwitchOption
                            value={true}
                            className={styles.switchOption}
                        >
                            <RemoteLogo
                                size="xxs"
                                chain={payload.pool?.chainId}
                                address={payload.pool?.tokens[0]?.address}
                            />
                            <Typography weight="medium">
                                {payload.pool?.tokens[0]?.symbol}
                            </Typography>
                        </SwitchOption>
                        <SwitchOption
                            value={false}
                            className={styles.switchOption}
                        >
                            <RemoteLogo
                                size="xxs"
                                chain={payload.pool?.chainId}
                                address={payload.pool?.tokens[1]?.address}
                            />
                            <Typography weight="medium">
                                {payload.pool?.tokens[1]?.symbol}
                            </Typography>
                        </SwitchOption>
                    </Switch>
                    <PoolRangePicker
                        pool={payload.pool}
                        currentPrice={currentPrice}
                        token0To1={token0To1}
                        from={rangePayload.priceRangeSpecification?.from}
                        to={rangePayload.priceRangeSpecification?.to}
                        onFromChange={handleFromOnChange}
                        onToChange={handleToOnChange}
                    />
                </div>
            </FormStepSection>
            <div
                className={classNames(styles.chartWrapper, {
                    [styles.noPadding]:
                        !!errors.range || loadingLiquidityDensity,
                })}
            >
                <LiquidityDensityChart
                    tooltipSize="xs"
                    header
                    token0To1={token0To1}
                    error={!!errors.range}
                    loading={loadingLiquidityDensity}
                    from={{
                        tick: rangePayload.priceRangeSpecification?.from?.tick,
                    }}
                    to={{
                        tick: rangePayload.priceRangeSpecification?.to?.tick,
                    }}
                    pool={payload.pool}
                    density={liquidityDensity}
                />
            </div>
            <div className={styles.buttons}>
                <Button
                    onClick={handleOnApply}
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    disabled={disabled || applyDisabled}
                    className={{ root: styles.button }}
                >
                    {t("saveRange")}
                </Button>
                <Button
                    onClick={handleOnSkip}
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    disabled={disabled}
                    variant="secondary"
                    className={{ root: styles.button }}
                >
                    {t("skipRange")}
                </Button>
            </div>
        </FormStep>
    );
}

import { StepNumberInput } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    type AmmPool,
    scaledPriceToTick,
    tickToScaledPrice,
} from "@metrom-xyz/sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormSteps } from "@/src/context/form-steps";
import type { AugmentedPriceRangeBound } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import type { LocalizedMessage } from "@/src/types/utils";

import styles from "./styles.module.css";

const PRICE_STEP = 0.01;
const RANGE_TICKS_LIMIT = 4000;

interface PoolRangeProps {
    pool?: AmmPool;
    currentPrice?: number;
    from?: AugmentedPriceRangeBound;
    to?: AugmentedPriceRangeBound;
    token0To1: boolean;
    onFromChange: (value: AugmentedPriceRangeBound | undefined) => void;
    onToChange: (value: AugmentedPriceRangeBound | undefined) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.inputs.rangePicker">;

export function PoolRangePicker({
    pool,
    currentPrice,
    from,
    to,
    token0To1,
    onFromChange,
    onToChange,
}: PoolRangeProps) {
    const [fromError, setFromError] = useState<ErrorMessage>("");
    const [toError, setToError] = useState<ErrorMessage>("");

    const t = useTranslations("newCampaign.inputs.rangePicker");
    const lastEdited = useRef<"from" | "to" | null>(null);
    const { updateErrors } = useFormSteps();

    useEffect(() => {
        if (!from && !to) {
            setFromError("");
            setToError("");
        } else if (!from && to) setFromError("errors.minPriceMissing");
        else if (!to && from) setToError("errors.maxPriceMissing");
        else if (!!from && !!to && from.tick >= to.tick) {
            if (lastEdited.current === "from") {
                setFromError("errors.minPriceMalformed");
                setToError("");
            } else {
                setFromError("");
                setToError("errors.maxPriceMalformed");
            }
        } else if (
            !!from &&
            !!to &&
            Math.abs(to.tick - from.tick) > RANGE_TICKS_LIMIT
        ) {
            setFromError("errors.rangeTooWide");
            setToError("errors.rangeTooWide");
        } else {
            setFromError("");
            setToError("");
        }
    }, [from, to]);

    useEffect(() => {
        const error = fromError || toError;
        updateErrors({ range: error ? t(error) : "" });
    }, [fromError, toError, updateErrors, t]);

    const getChangeHandler = useCallback(
        (type: "from" | "to") => {
            return (value?: number) => {
                lastEdited.current = type;
                const onChange = type === "from" ? onFromChange : onToChange;

                if (value === undefined || !pool) {
                    onChange(undefined);
                    return;
                }

                onChange({
                    price: value,
                    tick: scaledPriceToTick(value, pool, token0To1),
                });
            };
        },
        [onFromChange, onToChange, pool, token0To1],
    );

    const getStepHandler = useCallback(
        (type: "from" | "to", delta: "increment" | "decrement") => {
            return () => {
                lastEdited.current = type;
                if (currentPrice === undefined || !pool) return;

                const value = type === "from" ? from : to;
                const base = value?.price;
                const price = base || currentPrice;
                const newPrice =
                    price +
                    (delta === "increment"
                        ? price * PRICE_STEP
                        : price * -PRICE_STEP);
                const newTick = scaledPriceToTick(newPrice, pool, token0To1);

                const onChange = type === "from" ? onFromChange : onToChange;
                onChange({ price: newPrice, tick: newTick });
            };
        },
        [currentPrice, from, onFromChange, onToChange, pool, to, token0To1],
    );

    const getBlurHandler = useCallback(
        (type: "from" | "to") => {
            return () => {
                if (!pool) return;

                const value = type === "from" ? from : to;
                if (value === undefined) return;

                const newTick = scaledPriceToTick(value.price, pool, token0To1);
                const newPrice = tickToScaledPrice(newTick, pool, token0To1);

                const onChange = type === "from" ? onFromChange : onToChange;
                onChange({ price: newPrice, tick: newTick });
            };
        },
        [from, onFromChange, onToChange, pool, to, token0To1],
    );

    if (!pool) return;

    // TODO: handle pools with more than 2 tokens (such as stableswap3 pools)
    return (
        <div className={styles.root}>
            <StepNumberInput
                label={t("minPrice")}
                size="lg"
                step={1}
                error={!!fromError}
                errorText={fromError ? t(fromError) : ""}
                allowNegative={false}
                value={from?.price}
                onChange={getChangeHandler("from")}
                onDecrement={getStepHandler("from", "decrement")}
                onIncrement={getStepHandler("from", "increment")}
                onBlur={getBlurHandler("from")}
            />
            <StepNumberInput
                label={t("maxPrice")}
                size="lg"
                error={!!toError}
                errorText={toError ? t(toError) : ""}
                allowNegative={false}
                value={to?.price}
                onChange={getChangeHandler("to")}
                onDecrement={getStepHandler("to", "decrement")}
                onIncrement={getStepHandler("to", "increment")}
                onBlur={getBlurHandler("to")}
            />
        </div>
    );
}

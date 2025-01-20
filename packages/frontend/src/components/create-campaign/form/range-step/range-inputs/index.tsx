import { StepNumberInput } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    type AmmPool,
    scaledPriceToTick,
    tickToScaledPrice,
} from "@metrom-xyz/sdk";
import { useCallback } from "react";
import type { AugmentedPriceRangeBound } from "@/src/types";

import styles from "./styles.module.css";

const PRICE_STEP = 0.01;

interface RangeInputsProps {
    pool?: AmmPool;
    error?: boolean;
    currentPrice?: number;
    from?: AugmentedPriceRangeBound;
    to?: AugmentedPriceRangeBound;
    token0To1: boolean;
    onFromChange: (value: AugmentedPriceRangeBound | undefined) => void;
    onToChange: (value: AugmentedPriceRangeBound | undefined) => void;
}

export function RangeInputs({
    pool,
    error,
    currentPrice,
    from,
    to,
    token0To1,
    onFromChange,
    onToChange,
}: RangeInputsProps) {
    const t = useTranslations("newCampaign.form.range");

    const getChangeHandler = useCallback(
        (type: "from" | "to") => {
            return (value?: number) => {
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
                if (currentPrice === undefined || !pool) return;

                const value = type === "from" ? from : to;
                const base = value?.price;
                const newPrice =
                    (base || currentPrice) +
                    (delta === "increment" ? PRICE_STEP : -PRICE_STEP);
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

    // TODO: handle pools with more than 2 tokens (such as stableswap3 pools)
    return (
        <div className={styles.root}>
            <StepNumberInput
                label={t("minPrice", {
                    token0: pool?.tokens[token0To1 ? 0 : 1].symbol,
                    token1: pool?.tokens[token0To1 ? 1 : 0].symbol,
                })}
                placeholder="0.0"
                step={1}
                error={!!error}
                allowNegative={false}
                value={from?.price}
                onChange={getChangeHandler("from")}
                onDecrement={getStepHandler("from", "decrement")}
                onIncrement={getStepHandler("from", "increment")}
                onBlur={getBlurHandler("from")}
            />
            <StepNumberInput
                label={t("maxPrice", {
                    token0: pool?.tokens[token0To1 ? 0 : 1].symbol,
                    token1: pool?.tokens[token0To1 ? 1 : 0].symbol,
                })}
                placeholder="0.0"
                error={!!error}
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

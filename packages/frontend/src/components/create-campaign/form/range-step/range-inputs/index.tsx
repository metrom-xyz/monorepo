import type { CampaignPayload } from "@/src/types";
import {
    Button,
    StepNumberInput,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "react-use";

import styles from "./styles.module.css";

interface RangeInputsProps {
    tickPriceSpacing: number;
    error?: boolean;
    rangeSpecification?: CampaignPayload["priceRangeSpecification"];
    onTokenPriceFlip: () => void;
    onFromChange: (value: number | undefined) => void;
    onToChange: (value: number | undefined) => void;
}

export interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

export function RangeInputs({
    tickPriceSpacing,
    error,
    rangeSpecification,
    onTokenPriceFlip,
    onFromChange,
    onToChange,
}: RangeInputsProps) {
    const t = useTranslations("newCampaign.form.range");

    const [fromRaw, setFromRaw] = useState<NumberInputValues | undefined>(
        () => {
            if (rangeSpecification) {
                return {
                    raw: rangeSpecification.from,
                    formatted: rangeSpecification.from.toString(),
                };
            }
            return undefined;
        },
    );
    const [toRaw, setToRaw] = useState<NumberInputValues | undefined>(() => {
        if (rangeSpecification) {
            return {
                raw: rangeSpecification.to,
                formatted: rangeSpecification.to.toString(),
            };
        }
        return undefined;
    });

    useDebounce(
        () => {
            onFromChange(fromRaw?.raw);
        },
        200,
        [fromRaw],
    );

    useDebounce(
        () => {
            onToChange(toRaw?.raw);
        },
        200,
        [toRaw],
    );

    function handleLowerUsdTargetOnChange(value: NumberFormatValues) {
        setFromRaw({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleUpperUsdTargetOnChange(value: NumberFormatValues) {
        setToRaw({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleTokenPriceOnFlip() {
        onTokenPriceFlip();
        setToRaw({ raw: undefined, formatted: "" });
        setFromRaw({ raw: undefined, formatted: "" });
    }

    return (
        <div className={styles.root}>
            <Button
                variant="secondary"
                size="xs"
                onClick={handleTokenPriceOnFlip}
            >
                invert
            </Button>
            <StepNumberInput
                label={t("minPrice")}
                placeholder="$0"
                prefix="$"
                step={tickPriceSpacing}
                forceStep
                error={!!error}
                allowNegative={false}
                value={fromRaw?.formatted}
                onValueChange={handleLowerUsdTargetOnChange}
            />
            <StepNumberInput
                label={t("maxPrice")}
                placeholder="$0"
                prefix="$"
                step={tickPriceSpacing}
                forceStep
                error={!!error}
                allowNegative={false}
                value={toRaw?.formatted}
                onValueChange={handleUpperUsdTargetOnChange}
            />
        </div>
    );
}

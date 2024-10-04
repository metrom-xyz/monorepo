import type { CampaignPayload } from "@/src/types";
import {
    NumberInput,
    SliderInput,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useState, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "react-use";

import styles from "./styles.module.css";

interface GoalInputsProps {
    error?: boolean;
    kpiSpecification?: CampaignPayload["kpiSpecification"];
    onLowerUsdTargetChange: (value: number | undefined) => void;
    onUpperUsdTargetChange: (value: number | undefined) => void;
    onMinimumPayoutPercentageChange: (value: number) => void;
}

export interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

export function GoalInputs({
    error,
    kpiSpecification,
    onLowerUsdTargetChange,
    onUpperUsdTargetChange,
    onMinimumPayoutPercentageChange,
}: GoalInputsProps) {
    const t = useTranslations("newCampaign.form.kpi");

    const [minimumPayoutPercentage, setMinimumPayoutPercentage] = useState(
        kpiSpecification?.minimumPayoutPercentage || 0,
    );
    const [lowerUsdTargetRaw, setLowerUsdTargetRaw] = useState<
        NumberInputValues | undefined
    >(() => {
        if (kpiSpecification) {
            return {
                raw: kpiSpecification.goal.lowerUsdTarget,
                formatted: kpiSpecification.goal.lowerUsdTarget.toString(),
            };
        }
        return undefined;
    });
    const [upperUsdTargetRaw, setUpperUsdTargetRaw] = useState<
        NumberInputValues | undefined
    >(() => {
        if (kpiSpecification) {
            return {
                raw: kpiSpecification.goal.upperUsdTarget,
                formatted: kpiSpecification.goal.upperUsdTarget.toString(),
            };
        }
        return undefined;
    });

    useDebounce(
        () => {
            onLowerUsdTargetChange(lowerUsdTargetRaw?.raw);
        },
        500,
        [lowerUsdTargetRaw],
    );
    useDebounce(
        () => {
            onUpperUsdTargetChange(upperUsdTargetRaw?.raw);
        },
        500,
        [upperUsdTargetRaw],
    );
    useDebounce(
        () => {
            onMinimumPayoutPercentageChange(minimumPayoutPercentage);
        },
        500,
        [minimumPayoutPercentage],
    );

    function handleUpperUsdTargetOnChange(value: NumberFormatValues) {
        setUpperUsdTargetRaw({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleLowerUsdTargetOnChange(value: NumberFormatValues) {
        setLowerUsdTargetRaw({
            raw: value.floatValue,
            formatted: value.formattedValue,
        });
    }

    function handleMinimumPayoutOnChange(event: ChangeEvent<HTMLInputElement>) {
        setMinimumPayoutPercentage(Number(event.target.value) / 100);
    }

    return (
        <div className={styles.root}>
            <div className={styles.boundInputs}>
                <NumberInput
                    label={t("rangedTvl.lowerBound")}
                    placeholder="$0"
                    prefix="$"
                    error={!!error}
                    allowNegative={false}
                    value={lowerUsdTargetRaw?.formatted}
                    onValueChange={handleLowerUsdTargetOnChange}
                />
                <NumberInput
                    label={t("rangedTvl.upperBound")}
                    placeholder="$0"
                    prefix="$"
                    error={!!error}
                    allowNegative={false}
                    value={upperUsdTargetRaw?.formatted}
                    onValueChange={handleUpperUsdTargetOnChange}
                />
            </div>
            <SliderInput
                label={t("minimumPayout")}
                value={minimumPayoutPercentage * 100}
                onChange={handleMinimumPayoutOnChange}
                className={styles.minimumPayoutSlider}
            />
        </div>
    );
}

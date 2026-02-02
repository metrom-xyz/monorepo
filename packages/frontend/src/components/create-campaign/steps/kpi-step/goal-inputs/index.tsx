import type { BaseCampaignPayload } from "@/src/types/campaign";
import {
    NumberInput,
    SliderInput,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "react-use";
import numeral from "numeral";
import type { CampaignKind } from "@metrom-xyz/sdk";
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";

import styles from "./styles.module.css";

interface GoalInputsProps {
    error?: boolean;
    enabled?: boolean;
    kind?: CampaignKind;
    kpiSpecification?: BaseCampaignPayload["kpiSpecification"];
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
    enabled,
    kind,
    kpiSpecification,
    onLowerUsdTargetChange,
    onUpperUsdTargetChange,
    onMinimumPayoutPercentageChange,
}: GoalInputsProps) {
    const t = useTranslations("newCampaign.form.base.kpi");
    const targetValueName = useCampaignTargetValueName({ kind });

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

    useEffect(() => {
        if (!enabled) {
            setLowerUsdTargetRaw({ formatted: "", raw: undefined });
            setUpperUsdTargetRaw({ formatted: "", raw: undefined });
            setMinimumPayoutPercentage(0);
        }
    }, [enabled]);

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
                    label={t("rangedTarget.lowerBound", { targetValueName })}
                    prefix="$"
                    error={!!error}
                    allowNegative={false}
                    value={lowerUsdTargetRaw?.formatted}
                    onValueChange={handleLowerUsdTargetOnChange}
                />
                <NumberInput
                    label={t("rangedTarget.upperBound", { targetValueName })}
                    prefix="$"
                    error={!!error}
                    allowNegative={false}
                    value={upperUsdTargetRaw?.formatted}
                    onValueChange={handleUpperUsdTargetOnChange}
                />
            </div>
            <SliderInput
                label={t("minimumPayout")}
                max={99}
                value={minimumPayoutPercentage * 100}
                formattedValue={`${numeral(minimumPayoutPercentage * 100).format("0,0")}%`}
                onChange={handleMinimumPayoutOnChange}
                className={styles.minimumPayoutSlider}
            />
        </div>
    );
}

import type { CampaignPayloadKpiDistribution } from "@/src/types/campaign/common";
import { Chip, NumberInput, type NumberFormatValues } from "@metrom-xyz/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormSteps } from "@/src/context/form-steps";
import type { LocalizedMessage } from "@/src/types/utils";
import { formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";

interface KpiGoalInputsProps {
    targetValueName: string;
    kpiDistribution?: CampaignPayloadKpiDistribution;
    onLowerUsdTargetChange: (value: number | undefined) => void;
    onUpperUsdTargetChange: (value: number | undefined) => void;
    onMinimumPayoutPercentageChange: (value: number | undefined) => void;
}

export interface NumberInputValues {
    raw?: NumberFormatValues["floatValue"];
    formatted?: NumberFormatValues["formattedValue"];
}

type ErrorMessage = LocalizedMessage<"newCampaign.inputs.kpiGoalInputs">;

const MIN_PAYOUT_PRESETS = [25, 50];

export function KpiGoalInputs({
    targetValueName,
    kpiDistribution,
    onLowerUsdTargetChange,
    onUpperUsdTargetChange,
    onMinimumPayoutPercentageChange,
}: KpiGoalInputsProps) {
    const [lowerTargetError, setLowerTargetError] = useState<ErrorMessage>("");
    const [upperTargetError, setUpperTargetError] = useState<ErrorMessage>("");
    const [lowerUsdTarget, setLowerUsdTarget] = useState<number | undefined>(
        kpiDistribution?.goal?.lowerUsdTarget,
    );
    const [upperUsdTarget, setUpperUsdTarget] = useState<number | undefined>(
        kpiDistribution?.goal?.upperUsdTarget,
    );
    const [minimumPayoutPercentage, setMinimumPayoutPercentage] = useState<
        number | undefined
    >(kpiDistribution?.minimumPayoutPercentage);

    const t = useTranslations("newCampaign.inputs.kpiGoalInputs");
    const lastEdited = useRef<"lowerBound" | "upperBound" | null>(null);
    const { updateErrors } = useFormSteps();

    useEffect(() => {
        setLowerUsdTarget(kpiDistribution?.goal?.lowerUsdTarget);
        setUpperUsdTarget(kpiDistribution?.goal?.upperUsdTarget);
        setMinimumPayoutPercentage(kpiDistribution?.minimumPayoutPercentage);
    }, [kpiDistribution]);

    useEffect(() => {
        if (lowerUsdTarget === undefined && upperUsdTarget === undefined) {
            setLowerTargetError("");
            setUpperTargetError("");
            return;
        }

        if (lowerUsdTarget === undefined && upperUsdTarget !== undefined) {
            setLowerTargetError("errors.missingLowerBound");
            return;
        }

        if (upperUsdTarget === undefined && lowerUsdTarget !== undefined) {
            setUpperTargetError("errors.missingUpperBound");
            return;
        }

        if (
            lowerUsdTarget !== undefined &&
            upperUsdTarget !== undefined &&
            lowerUsdTarget >= upperUsdTarget
        ) {
            if (lastEdited.current === "lowerBound")
                setLowerTargetError("errors.lowerBoundMalformed");
            if (lastEdited.current === "upperBound")
                setUpperTargetError("errors.upperBoundMalformed");
            return;
        }

        if (
            lowerUsdTarget !== undefined &&
            upperUsdTarget !== undefined &&
            lowerUsdTarget === upperUsdTarget
        ) {
            setLowerTargetError("errors.boundsEqual");
            setUpperTargetError("errors.boundsEqual");
            return;
        }

        setLowerTargetError("");
        setUpperTargetError("");
    }, [lowerUsdTarget, upperUsdTarget]);

    useEffect(() => {
        const error = lowerTargetError || upperTargetError;
        updateErrors({ kpi: error ? t(error) : "" });
    }, [lowerTargetError, upperTargetError, updateErrors, t]);

    function handleUpperUsdTargetOnChange({ floatValue }: NumberFormatValues) {
        lastEdited.current = "upperBound";
        setUpperUsdTarget(floatValue);
    }

    function handleUpperUsdTargetOnBlur() {
        onUpperUsdTargetChange(upperUsdTarget);
    }

    function handleLowerUsdTargetOnChange({ floatValue }: NumberFormatValues) {
        lastEdited.current = "lowerBound";
        setLowerUsdTarget(floatValue);
    }

    function handleLowerUsdTargetOnBlur() {
        onLowerUsdTargetChange(lowerUsdTarget);
    }

    function handleMinimumPayoutOnChange({ floatValue }: NumberFormatValues) {
        setMinimumPayoutPercentage(floatValue);
    }

    const handleMinimumPayoutOnBlur = useCallback(() => {
        const normalizedValue =
            minimumPayoutPercentage !== undefined
                ? Math.min(minimumPayoutPercentage, 99)
                : undefined;
        setMinimumPayoutPercentage(normalizedValue);
        onMinimumPayoutPercentageChange(normalizedValue);
    }, [minimumPayoutPercentage, onMinimumPayoutPercentageChange]);

    const getMinimumPayoutPresetHandler = useCallback(
        (value: number) => {
            return () => {
                setMinimumPayoutPercentage(value);
                onMinimumPayoutPercentageChange(value);
            };
        },
        [onMinimumPayoutPercentageChange],
    );

    return (
        <div className={styles.root}>
            <NumberInput
                size="lg"
                label={t("rangedTarget.lowerBound", { targetValueName })}
                prefix="$"
                error={!!lowerTargetError}
                errorText={lowerTargetError ? t(lowerTargetError) : ""}
                allowNegative={false}
                value={lowerUsdTarget ?? ""}
                onValueChange={handleLowerUsdTargetOnChange}
                onBlur={handleLowerUsdTargetOnBlur}
                className={styles.input}
            />
            <NumberInput
                size="lg"
                label={t("rangedTarget.upperBound", { targetValueName })}
                prefix="$"
                error={!!upperTargetError}
                errorText={upperTargetError ? t(upperTargetError) : ""}
                allowNegative={false}
                value={upperUsdTarget ?? ""}
                onValueChange={handleUpperUsdTargetOnChange}
                onBlur={handleUpperUsdTargetOnBlur}
                className={styles.input}
            />
            <NumberInput
                size="lg"
                label={t("minimumPayout")}
                suffix="%"
                allowNegative={false}
                value={minimumPayoutPercentage ?? ""}
                onValueChange={handleMinimumPayoutOnChange}
                endAdornment={
                    <div className={styles.minPayoutPresets}>
                        {MIN_PAYOUT_PRESETS.map((value, index) => (
                            <Chip
                                key={index}
                                size="xs"
                                variant="secondary"
                                onClick={getMinimumPayoutPresetHandler(value)}
                            >
                                {formatPercentage({ percentage: value })}
                            </Chip>
                        ))}
                    </div>
                }
                onBlur={handleMinimumPayoutOnBlur}
                className={styles.input}
            />
        </div>
    );
}

import type { CampaignPayloadKpiDistribution } from "@/src/types/campaign/common";
import { NumberInput, type NumberFormatValues } from "@metrom-xyz/ui";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormSteps } from "@/src/context/form-steps";
import type { LocalizedMessage } from "@/src/types/utils";

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
            setLowerTargetError("errors.missingUpperBound");
            return;
        }

        if (
            lowerUsdTarget !== undefined &&
            upperUsdTarget !== undefined &&
            lowerUsdTarget >= upperUsdTarget
        ) {
            setLowerTargetError("errors.lowerBoundMalformed");
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
        setUpperUsdTarget(floatValue);
    }

    function handleUpperUsdTargetOnBlur() {
        onUpperUsdTargetChange(upperUsdTarget);
    }

    function handleLowerUsdTargetOnChange({ floatValue }: NumberFormatValues) {
        setLowerUsdTarget(floatValue);
    }

    function handleLowerUsdTargetOnBlur() {
        onLowerUsdTargetChange(lowerUsdTarget);
    }

    function handleMinimumPayoutOnChange({ floatValue }: NumberFormatValues) {
        setMinimumPayoutPercentage(floatValue);
    }

    function handleMinimumPayoutOnBlur() {
        const normalizedValue =
            minimumPayoutPercentage !== undefined
                ? Math.min(minimumPayoutPercentage, 99)
                : undefined;
        setMinimumPayoutPercentage(normalizedValue);
        onMinimumPayoutPercentageChange(normalizedValue);
    }

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
                onBlur={handleMinimumPayoutOnBlur}
                className={styles.input}
            />
        </div>
    );
}

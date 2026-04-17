import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type {
    BaseCampaignPayload,
    BaseCampaignPayloadPart,
} from "@/src/types/campaign/common";
import { StartDatePicker } from "../../inputs/start-date-picker";
import { StepSection } from "../../form/step-section";
import { EndDatePicker } from "../../inputs/end-date-picker";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useFormSteps } from "@/src/context/form-steps";
import { FormStepId } from "@/src/types/form";

import styles from "./styles.module.css";

interface CampaignBasicsStepProps {
    payload: BaseCampaignPayload;
    targetSection: ReactNode;
    startDatePickerDisabled?: boolean;
    applyDisabled?: boolean;
    completed?: boolean;
    unsavedChanges?: boolean;
    onChange: (payload: BaseCampaignPayloadPart) => void;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

export function CampaignBasicsStep({
    payload,
    targetSection,
    startDatePickerDisabled,
    applyDisabled,
    completed,
    unsavedChanges,
    onChange,
    onApply,
}: CampaignBasicsStepProps) {
    const [open, setOpen] = useState(true);
    const [applied, setApplied] = useState(false);

    const t = useTranslations("newCampaign.form.basics");
    const { errors, activeStepId, updateErrors, updateUnsaved } =
        useFormSteps();

    useEffect(() => {
        if (applied || completed) return;
        setOpen(activeStepId === FormStepId.Basics);
    }, [applied, completed, activeStepId]);

    useEffect(() => {
        updateUnsaved({ basics: unsavedChanges });
    }, [unsavedChanges, updateUnsaved]);

    const handleOnApply = useCallback(() => {
        onApply(payload, FormStepId.Basics);
        setApplied(true);
        setOpen(false);
    }, [payload, onApply]);

    const handleOnError = useCallback(
        (error?: string) => {
            updateErrors({ basics: error });
        },
        [updateErrors],
    );

    return (
        <FormStep
            title={t("title")}
            open={open}
            error={errors.basics}
            warning={
                !errors.basics && !open && unsavedChanges
                    ? t("notSaved")
                    : undefined
            }
            completed={completed}
            onToggle={setOpen}
            className={styles.root}
        >
            {targetSection}
            <StepSection title={t("defineDuration")}>
                <div className={styles.datePickers}>
                    <StartDatePicker
                        disabled={startDatePickerDisabled}
                        startDate={payload.startDate}
                        endDate={payload.endDate}
                        onChange={onChange}
                        onError={handleOnError}
                    />
                    <EndDatePicker
                        disabled={!payload.startDate}
                        startDate={payload.startDate}
                        endDate={payload.endDate}
                        onChange={onChange}
                        onError={handleOnError}
                    />
                </div>
            </StepSection>
            <Button
                onClick={handleOnApply}
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={applyDisabled}
                className={{ root: styles.button }}
            >
                {t("saveBasics")}
            </Button>
        </FormStep>
    );
}

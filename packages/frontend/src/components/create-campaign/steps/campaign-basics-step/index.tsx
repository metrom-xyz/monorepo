import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import { useCallback, useState, type ReactNode } from "react";
import type {
    BaseCampaignPayload,
    BaseCampaignPayloadPart,
} from "@/src/types/campaign/common";
import { StartDatePicker } from "../../inputs/start-date-picker";
import { StepSection } from "../../form/step-section";
import { EndDatePicker } from "../../inputs/end-date-picker";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import type { CompletedRequiredSteps } from "../../form";
import { useFormErrors } from "@/src/context/form-errors";

import styles from "./styles.module.css";

interface CampaignBasicsStepProps {
    payload: BaseCampaignPayload;
    targetSection: ReactNode;
    startDatePickerDisabled?: boolean;
    applyDisabled?: boolean;
    completed?: boolean;
    unsavedChanges?: boolean;
    onComplete: (steps: Partial<CompletedRequiredSteps>) => void;
    onChange: (payload: BaseCampaignPayloadPart) => void;
    onApply: (payload: BaseCampaignPayloadPart) => void;
}

export function CampaignBasicsStep({
    payload,
    targetSection,
    startDatePickerDisabled,
    applyDisabled,
    completed,
    unsavedChanges,
    onComplete,
    onChange,
    onApply,
}: CampaignBasicsStepProps) {
    const [open, setOpen] = useState(true);

    const t = useTranslations("newCampaign.form.basics");
    const { errors, updateErrors } = useFormErrors();

    const handleOnApply = useCallback(() => {
        onApply(payload);
        setOpen(false);
        onComplete({ basics: true });
    }, [payload, onApply, onComplete]);

    const handleOnError = useCallback(
        (error?: string) => {
            updateErrors({ basics: error });
            onComplete({ basics: false });
        },
        [onComplete, updateErrors],
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
                disabled={applyDisabled}
                className={{ root: styles.button }}
            >
                {t("saveBasics")}
            </Button>
        </FormStep>
    );
}

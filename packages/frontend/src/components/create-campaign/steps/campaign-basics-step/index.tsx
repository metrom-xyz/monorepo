import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import { useCallback, useState, type ReactNode } from "react";
import type {
    BaseCampaignPayload,
    BaseCampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types/campaign/common";
import { StartDatePicker } from "../../inputs/start-date-picker";
import { StepSection } from "../../form/step-section";
import { EndDatePicker } from "../../inputs/end-date-picker";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

interface CampaignBasicsStepProps {
    payload: BaseCampaignPayload;
    targetSection: ReactNode;
    startDatePickerDisabled?: boolean;
    applyDisabled?: boolean;
    error?: string;
    completed?: boolean;
    unsavedChanges?: boolean;
    onChange: (payload: BaseCampaignPayloadPart) => void;
    onApply: (payload: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function CampaignBasicsStep({
    payload,
    targetSection,
    startDatePickerDisabled,
    applyDisabled,
    error,
    completed,
    unsavedChanges,
    onChange,
    onApply,
    onError,
}: CampaignBasicsStepProps) {
    const [open, setOpen] = useState(true);

    const t = useTranslations("newCampaign.form.basics");

    const handleOnApply = useCallback(() => {
        onApply(payload);
        setOpen(false);
    }, [payload, onApply]);

    return (
        <FormStep
            title={t("title")}
            open={open}
            error={error}
            warning={!open && unsavedChanges ? t("notSaved") : undefined}
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
                        onError={onError}
                    />
                    <EndDatePicker
                        disabled={!payload.startDate}
                        startDate={payload.startDate}
                        endDate={payload.endDate}
                        onChange={onChange}
                        onError={onError}
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

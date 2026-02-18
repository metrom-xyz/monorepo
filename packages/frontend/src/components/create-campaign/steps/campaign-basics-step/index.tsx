import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import { useState, type ReactNode } from "react";
import type { Dayjs } from "dayjs";
import type {
    BaseCampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types/campaign/common";
import { StartDatePicker } from "../../inputs/start-date-picker";
import { StepSection } from "../../form/step-section";
import { Typography } from "@metrom-xyz/ui";
import { EndDatePicker } from "../../inputs/end-date-picker";

import styles from "./styles.module.css";

interface CampaignBasicsStepProps {
    startDatePickerDisabled?: boolean;
    startDate?: Dayjs;
    endDate?: Dayjs;
    targetSection: ReactNode;
    onChange: (date: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function CampaignBasicsStep({
    startDatePickerDisabled,
    startDate,
    endDate,
    targetSection,
    onChange,
    onError,
}: CampaignBasicsStepProps) {
    const t = useTranslations("newCampaign.form.basics");

    const [open, setOpen] = useState(true);

    return (
        <FormStep
            title={t("title")}
            open={open}
            onToggle={setOpen}
            completed={false}
            className={styles.root}
        >
            {targetSection}
            <StepSection
                title={
                    <Typography weight="semibold">
                        {t("defineDuration")}
                    </Typography>
                }
            >
                <div className={styles.datePickers}>
                    <StartDatePicker
                        disabled={startDatePickerDisabled}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={onChange}
                        onError={onError}
                    />
                    <EndDatePicker
                        disabled={!startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={onChange}
                        onError={onError}
                    />
                </div>
            </StepSection>
        </FormStep>
    );
}

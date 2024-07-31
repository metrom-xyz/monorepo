import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";

interface StartDateStepProps {
    disabled?: boolean;
    startDate?: CampaignPayload["startDate"];
    onStartDateChange?: (startDate: CampaignPayloadPart) => void;
}

export function StartDateStep({
    disabled,
    startDate,
    onStartDateChange,
}: StartDateStepProps) {
    const t = useTranslations("new_campaign.form.start_date");

    return (
        <Step disabled={disabled}>
            <StepPreview label={t("title")}></StepPreview>
            <StepContent>todo</StepContent>
        </Step>
    );
}

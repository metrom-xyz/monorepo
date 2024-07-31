import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { Typography } from "@/src/ui/typography";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";

interface EndDateStepProps {
    disabled?: boolean;
    endDate?: CampaignPayload["endDate"];
    onEndDateChange?: (startDate: CampaignPayloadPart) => void;
}

export function EndDateStep({
    disabled,
    endDate,
    onEndDateChange,
}: EndDateStepProps) {
    const t = useTranslations("new_campaign.form.end_date");

    return (
        <Step disabled={disabled}>
            <StepPreview>
                <Typography uppercase variant="lg" weight="medium">
                    {t("title")}
                </Typography>
            </StepPreview>
            <StepContent>todo</StepContent>
        </Step>
    );
}

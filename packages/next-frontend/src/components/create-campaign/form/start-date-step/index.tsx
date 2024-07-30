import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { Typography } from "@/src/ui/typography";
import { StepContent } from "@/src/components/step/content";
import type { CreateCampaignFormProps } from "..";

interface StartDateStepProps extends CreateCampaignFormProps {}

export function StartDateStep({
    payload,
    payloadIndex,
    onPayloadChange,
}: StartDateStepProps) {
    const t = useTranslations("new_campaign.form.start_date");

    return (
        <Step disabled>
            <StepPreview>
                <Typography uppercase variant="lg" weight="medium">
                    {t("title")}
                </Typography>
            </StepPreview>
            <StepContent>todo</StepContent>
        </Step>
    );
}

import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { Typography } from "@/src/ui/typography";
import { StepContent } from "@/src/components/step/content";
import type { CreateCampaignFormProps } from "..";

interface PoolStepProps extends CreateCampaignFormProps {}

export function PoolStep({
    payload,
    payloadIndex,
    onPayloadChange,
}: PoolStepProps) {
    const t = useTranslations("new_campaign.form.pool");

    return (
        <Step disabled={!payload?.amm}>
            <StepPreview>
                <Typography uppercase variant="lg" weight="medium">
                    {t("title")}
                </Typography>
            </StepPreview>
            <StepContent>todo</StepContent>
        </Step>
    );
}

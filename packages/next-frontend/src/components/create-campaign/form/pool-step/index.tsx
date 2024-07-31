import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { Typography } from "@/src/ui/typography";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";

interface PoolStepProps {
    disabled?: boolean;
    pool?: CampaignPayload["pool"];
    onPoolChange: (pool: CampaignPayloadPart) => void;
}

export function PoolStep({ disabled, pool, onPoolChange }: PoolStepProps) {
    const t = useTranslations("new_campaign.form.pool");

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

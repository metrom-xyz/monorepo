import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
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
            <StepPreview label={t("title")}></StepPreview>
            <StepContent>todo</StepContent>
        </Step>
    );
}

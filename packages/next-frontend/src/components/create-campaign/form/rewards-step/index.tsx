import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useAvailableAmms } from "@/src/hooks/useAvailableAmms";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";

import styles from "./styles.module.css";

interface RewardsStepProps {
    disabled?: boolean;
    rewards?: CampaignPayload["rewards"];
    onRewardsChange: (rewards: CampaignPayloadPart) => void;
}

export function RewardsStep({
    disabled,
    rewards,
    onRewardsChange,
}: RewardsStepProps) {
    const t = useTranslations("new_campaign.form.rewards");
    const [open, setOpen] = useState(false);
    const availableAmms = useAvailableAmms();
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!rewards}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}></StepPreview>
            <StepContent>todo</StepContent>
        </Step>
    );
}

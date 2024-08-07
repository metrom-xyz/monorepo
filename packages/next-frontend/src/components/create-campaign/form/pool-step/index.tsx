import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import type { Pool } from "@metrom-xyz/sdk";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { PoolPicker } from "./picker";
import { Typography } from "@/src/ui/typography";
import { PoolStepPreview } from "./preview";

import styles from "./styles.module.css";

interface PoolStepProps {
    disabled?: boolean;
    amm?: CampaignPayload["amm"];
    pool?: CampaignPayload["pool"];
    onPoolChange: (pool: CampaignPayloadPart) => void;
}

export function PoolStep({ disabled, pool, amm, onPoolChange }: PoolStepProps) {
    const t = useTranslations("new_campaign.form.pool");
    const [open, setOpen] = useState(false);
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    const handlePoolOnChange = useCallback(
        (newPool: Pool) => {
            if (pool && pool.address === newPool.address) return;
            onPoolChange({ pool: newPool });
            setOpen(false);
        },
        [pool, onPoolChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!pool}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    !pool ? (
                        t("title")
                    ) : (
                        <div className={styles.previewCompletedLabel}>
                            <Typography uppercase weight="medium">
                                {t("preview.pool")}
                            </Typography>
                            <Typography uppercase weight="medium">
                                {t("preview.tvl")}
                            </Typography>
                        </div>
                    )
                }
            >
                {pool && <PoolStepPreview pool={pool} />}
            </StepPreview>
            <StepContent>
                <PoolPicker
                    amm={amm}
                    value={pool}
                    onChange={handlePoolOnChange}
                />
            </StepContent>
        </Step>
    );
}

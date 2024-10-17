import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import type { PoolWithTvl } from "@metrom-xyz/sdk";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { PoolPicker } from "./picker";
import { Typography } from "@metrom-xyz/ui";
import { PoolStepPreview } from "./preview";

import styles from "./styles.module.css";

interface PoolStepProps {
    disabled?: boolean;
    amm?: CampaignPayload["amm"];
    pool?: CampaignPayload["pool"];
    onPoolChange: (pool: CampaignPayloadPart) => void;
}

export function PoolStep({ disabled, pool, amm, onPoolChange }: PoolStepProps) {
    const t = useTranslations("newCampaign.form.pool");
    const [open, setOpen] = useState(false);
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!pool) return;
        setOpen(true);
    }, [pool, disabled]);

    const handlePoolOnChange = useCallback(
        (newPool: PoolWithTvl) => {
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
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("preview.pool")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("preview.tvl")}
                            </Typography>
                        </div>
                    )
                }
            >
                {pool && <PoolStepPreview {...pool} />}
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

import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { type AmmPool } from "@metrom-xyz/sdk";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { PoolPicker } from "./picker";
import { Typography } from "@metrom-xyz/ui";
import { PoolStepPreview } from "./preview";
import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types";

import styles from "./styles.module.css";

interface PoolStepProps {
    disabled?: boolean;
    dex?: AmmPoolLiquidityCampaignPayload["dex"];
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    onPoolChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
}

export function PoolStep({ disabled, dex, pool, onPoolChange }: PoolStepProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.pool");
    const [open, setOpen] = useState(false);
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!pool?.address) return;
        setOpen(true);
    }, [disabled, pool]);

    const handlePoolOnChange = useCallback(
        (newPool: AmmPool) => {
            if (pool && pool.address === newPool.address) return;
            onPoolChange({
                pool: newPool,
            });
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
                    dex={dex?.slug}
                    value={pool}
                    onChange={handlePoolOnChange}
                />
            </StepContent>
        </Step>
    );
}

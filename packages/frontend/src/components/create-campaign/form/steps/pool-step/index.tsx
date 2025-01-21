import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import {
    type AmmPool,
    type AmmPoolLiquidityTarget,
    TargetType,
} from "@metrom-xyz/sdk";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { PoolPicker } from "./picker";
import { Typography } from "@metrom-xyz/ui";
import { PoolStepPreview } from "./preview";
import type { CampaignPayload, TargetedCampaignPayloadPart } from "@/src/types";

import styles from "./styles.module.css";

interface PoolStepProps {
    disabled?: boolean;
    protocol?: CampaignPayload["protocol"];
    target?: AmmPoolLiquidityTarget;
    onTargetChange: (
        target: TargetedCampaignPayloadPart<TargetType.AmmPoolLiquidity>,
    ) => void;
}

export function PoolStep({
    disabled,
    protocol,
    target,
    onTargetChange,
}: PoolStepProps) {
    const t = useTranslations("newCampaign.form.pool");
    const [open, setOpen] = useState(false);
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!target?.pool?.address) return;
        setOpen(true);
    }, [disabled, target]);

    const handlePoolOnChange = useCallback(
        (newPool: AmmPool) => {
            if (target?.pool && target.pool.address === newPool.address) return;
            onTargetChange({
                target: {
                    chainId,
                    type: TargetType.AmmPoolLiquidity,
                    pool: newPool,
                },
            });
            setOpen(false);
        },
        [target, chainId, onTargetChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!target?.pool}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    !target?.pool ? (
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
                {target?.pool && <PoolStepPreview {...target.pool} />}
            </StepPreview>
            <StepContent>
                <PoolPicker
                    protocol={protocol}
                    value={target?.pool}
                    onChange={handlePoolOnChange}
                />
            </StepContent>
        </Step>
    );
}

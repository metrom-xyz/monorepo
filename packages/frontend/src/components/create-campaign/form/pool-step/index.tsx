import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import { ErrorText, Typography } from "@metrom-xyz/ui";
import { PoolStepPreview } from "./preview";
import classNames from "classnames";
import type { PoolWithTvl } from "@metrom-xyz/sdk";
import { AddressPoolPicker } from "./address-picker";
import { ListPoolPicker } from "./list";

import styles from "./styles.module.css";

interface PoolStepProps {
    disabled?: boolean;
    dex?: CampaignPayload["dex"];
    pool?: CampaignPayload["pool"];
    onPoolChange: (pool: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function PoolStep({
    disabled,
    pool,
    dex,
    onPoolChange,
    onError,
}: PoolStepProps) {
    const t = useTranslations("newCampaign.form.pool");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!pool) return;
        setOpen(true);
    }, [pool, disabled]);

    useEffect(() => {
        onError({ pool: !!error });
    }, [onError, error]);

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
            error={!!error}
        >
            <StepPreview
                label={
                    !pool ? (
                        <div className={styles.previewLabelWrapper}>
                            <div className={styles.previewTextWrapper}>
                                <Typography
                                    uppercase
                                    weight="medium"
                                    className={styles.previewLabel}
                                >
                                    {t("title")}
                                </Typography>
                                {error && (
                                    <ErrorText
                                        size="xs"
                                        weight="medium"
                                        level="error"
                                        className={classNames(styles.error, {
                                            [styles.errorVisible]: error,
                                        })}
                                    >
                                        {error}
                                    </ErrorText>
                                )}
                            </div>
                        </div>
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
                {dex?.supportsFetchAllPools ? (
                    <ListPoolPicker
                        value={pool}
                        dex={dex}
                        onChange={handlePoolOnChange}
                    />
                ) : (
                    <AddressPoolPicker
                        dex={dex}
                        onChange={handlePoolOnChange}
                        onError={setError}
                    />
                )}
            </StepContent>
        </Step>
    );
}

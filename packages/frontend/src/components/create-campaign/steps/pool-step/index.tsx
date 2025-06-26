import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { type AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { ErrorText, Typography } from "@metrom-xyz/ui";
import { PoolStepPreview } from "./preview";
import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
    CampaignPayloadErrors,
    FormStepBaseProps,
} from "@/src/types/campaign";
import { ListPoolPicker } from "./list";
import { AddressPoolPicker } from "./address-picker";
import { usePrevious } from "react-use";

import styles from "./styles.module.css";

interface PoolStepProps extends FormStepBaseProps {
    dex?: AmmPoolLiquidityCampaignPayload["dex"];
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    onPoolChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function PoolStep({
    loading,
    disabled,
    dex,
    pool,
    onPoolChange,
    onError,
}: PoolStepProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.pool");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const chainId = useChainId();

    const prevDex = usePrevious(dex);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!pool?.id) setOpen(false);
        else setOpen(true);
    }, [disabled, pool]);

    useEffect(() => {
        onError({ pool: !!error });
    }, [onError, error]);

    useEffect(() => {
        if (!!prevDex && !!dex && prevDex.slug !== dex.slug)
            onPoolChange({ pool: undefined });
    }, [onPoolChange, prevDex, dex]);

    const handlePoolOnChange = useCallback(
        (newPool: AmmPoolWithTvl) => {
            if (pool && pool.id === newPool.id) return;
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
            loading={loading}
            disabled={disabled}
            open={open}
            completed={!!pool}
            onPreviewClick={handleStepOnClick}
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
                                <ErrorText
                                    size="xs"
                                    weight="medium"
                                    level="error"
                                >
                                    {error}
                                </ErrorText>
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
                        dex={dex.slug}
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

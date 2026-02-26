import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography, ErrorText, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { type CampaignPayloadErrors } from "@/src/types/campaign/common";
import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { WeightingInputs } from "./weighting-inputs";
import type { LocalizedMessage } from "@/src/types/utils";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { usePrevious } from "react-use";
import { formatPercentage } from "@/src/utils/format";
import { InfoMessage } from "@/src/components/info-message";

import styles from "./styles.module.css";

interface WeightingStepProps {
    disabled?: boolean;
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    weighting?: AmmPoolLiquidityCampaignPayload["weighting"];
    onWeightingChange: (weighting: AmmPoolLiquidityCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.base.weighting">;

export function WeightingStep({
    disabled,
    pool,
    weighting,
    onWeightingChange,
    onError,
}: WeightingStepProps) {
    const t = useTranslations("newCampaign.form.base.weighting");

    const [open, setOpen] = useState(false);
    const [warning, setWarning] = useState<ErrorMessage>("");
    const [token0, setToken0] = useState<number>(weighting?.token0 || 0);
    const [token1, setToken1] = useState<number>(weighting?.token1 || 0);

    const { id: chainId } = useChainWithType();
    const prevWeighting = usePrevious(weighting);

    const liquidity = useMemo(() => {
        return Math.max(100 - (token0 || 0) - (token1 || 0), 0);
    }, [token0, token1]);

    const unsavedChanges = useMemo(() => {
        if (disabled) return false;

        return (
            !prevWeighting ||
            prevWeighting.token0 !== token0 ||
            prevWeighting.token1 !== token1 ||
            prevWeighting.liquidity !== liquidity
        );
    }, [disabled, prevWeighting, token0, token1, liquidity]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!weighting) return;
        setOpen(true);
    }, [disabled, weighting]);

    useEffect(() => {
        onError({ weighting: unsavedChanges || !weighting });
    }, [unsavedChanges, weighting, onError]);

    useEffect(() => {
        if ((!open || prevWeighting) && unsavedChanges)
            setWarning("notApplied");
        else setWarning("");
    }, [open, prevWeighting, unsavedChanges]);

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    const handleApply = useCallback(() => {
        if (token0 === undefined || token1 === undefined) return;

        setOpen(false);
        onWeightingChange({
            weighting: {
                token0,
                token1,
                liquidity,
            },
        });
    }, [token0, token1, liquidity, onWeightingChange]);

    const token0Symbol = pool?.tokens[0].symbol;
    const token1Symbol = pool?.tokens[1].symbol;

    return (
        <Step
            disabled={disabled}
            completed={!!weighting}
            open={open}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
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
                                level="warning"
                            >
                                {warning ? t(warning) : null}
                            </ErrorText>
                        </div>
                    </div>
                }
            >
                <div className={styles.weightsWrapper}>
                    <div className={styles.weight}>
                        <Typography
                            uppercase
                            variant="tertiary"
                            weight="medium"
                            size="sm"
                        >
                            {token0Symbol}
                        </Typography>
                        <Typography uppercase weight="medium" size="sm">
                            {formatPercentage({
                                percentage: weighting?.token0,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.weight}>
                        <Typography
                            uppercase
                            variant="tertiary"
                            weight="medium"
                            size="sm"
                        >
                            {token1Symbol}
                        </Typography>
                        <Typography uppercase weight="medium" size="sm">
                            {formatPercentage({
                                percentage: weighting?.token1,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.weight}>
                        <Typography
                            uppercase
                            variant="tertiary"
                            weight="medium"
                            size="sm"
                        >
                            {t("fees")}
                        </Typography>
                        <Typography uppercase weight="medium" size="sm">
                            {formatPercentage({
                                percentage: weighting?.liquidity ?? 100,
                            })}
                        </Typography>
                    </div>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <InfoMessage
                        text={t.rich("infoMessage", {
                            token0: token0Symbol || "",
                            token1: token1Symbol || "",
                            bold: (chunks) => (
                                <span className={styles.boldText}>
                                    {chunks}
                                </span>
                            ),
                        })}
                        link="https://docs.metrom.xyz/creating-a-campaign/reward-ratio"
                        linkText={t("readMore")}
                    />
                    <WeightingInputs
                        pool={pool}
                        liquidity={liquidity}
                        token0={token0}
                        token1={token1}
                        onToken0Change={setToken0}
                        onToken1Change={setToken1}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={
                            !unsavedChanges ||
                            token0 === undefined ||
                            token1 === undefined
                        }
                        onClick={handleApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}

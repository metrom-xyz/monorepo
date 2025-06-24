import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography, ErrorText, Switch, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import {
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
    type CampaignPayloadErrors,
    type FormStepBaseProps,
} from "@/src/types/campaign";
import { WeightingInputs } from "./weighting-inputs";
import type { LocalizedMessage } from "@/src/types/utils";
import { useChainId } from "wagmi";
import { usePrevious } from "react-use";
import { formatPercentage } from "@/src/utils/format";
import { InfoMessage } from "@/src/components/info-message";
import { DistributablesType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface WeightingStepProps extends FormStepBaseProps {
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    distributablesType?: DistributablesType;
    weighting?: AmmPoolLiquidityCampaignPayload["weighting"];
    onWeightingChange: (weighting: AmmPoolLiquidityCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.base.weighting">;

export function WeightingStep({
    autoCompleted,
    disabled,
    pool,
    distributablesType,
    weighting,
    onWeightingChange,
    onError,
}: WeightingStepProps) {
    const t = useTranslations("newCampaign.form.base.weighting");

    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [warning, setWarning] = useState<ErrorMessage>("");
    const [token0, setToken0] = useState<number | undefined>();
    const [token1, setToken1] = useState<number | undefined>();

    const chainId = useChainId();
    const prevWeighting = usePrevious(weighting);

    const liquidity = useMemo(() => {
        return Math.max(100 - (token0 || 0) - (token1 || 0), 0);
    }, [token0, token1]);

    const unsavedChanges = useMemo(() => {
        return (
            !prevWeighting ||
            prevWeighting.token0 !== token0 ||
            prevWeighting.token1 !== token1 ||
            prevWeighting.liquidity !== liquidity
        );
    }, [prevWeighting, token0, token1, liquidity]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!!weighting) {
            const { token0, token1 } = weighting;

            setToken0(token0);
            setToken1(token1);
        }
    }, [weighting]);

    useEffect(() => {
        if (autoCompleted && !!weighting) {
            setEnabled(true);
            setOpen(false);
        } else setOpen(enabled);
    }, [autoCompleted, weighting, enabled]);

    useEffect(() => {
        if (enabled && !open && unsavedChanges) setWarning("notApplied");
        else setWarning("");
    }, [enabled, open, unsavedChanges]);

    useEffect(() => {
        onError({
            weighting: enabled && !weighting,
        });
    }, [enabled, weighting, onError]);

    // This hook is used to reset and disable the step when changing reward type to points.
    useEffect(() => {
        if (distributablesType === DistributablesType.Tokens) return;

        onWeightingChange({ weighting: undefined });
        setToken0(undefined);
        setToken1(undefined);
        setEnabled(false);
    }, [distributablesType, onWeightingChange]);

    // This hooks is used to disable and close the step when
    // the weighting gets disabled, after the campaign creation.
    useEffect(() => {
        if (!autoCompleted && enabled && !!prevWeighting && !weighting)
            setEnabled(false);
    }, [autoCompleted, enabled, prevWeighting, weighting]);

    function handleSwitchOnClick(
        _: boolean,
        event:
            | React.MouseEvent<HTMLButtonElement>
            | React.KeyboardEvent<HTMLButtonElement>,
    ) {
        event.stopPropagation();
        setEnabled((enabled) => !enabled);

        if (weighting) {
            onWeightingChange({ weighting: undefined });
            setToken0(undefined);
            setToken1(undefined);
        }
    }

    function handleStepOnClick() {
        if (!enabled) return;
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
            completed={enabled}
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
                                {!!warning ? t(warning) : null}
                            </ErrorText>
                        </div>
                        <Switch
                            tabIndex={-1}
                            size="lg"
                            checked={enabled}
                            onClick={handleSwitchOnClick}
                        />
                    </div>
                }
                decorator={false}
                disabled={!enabled}
            >
                <div className={styles.weightsWrapper}>
                    <div className={styles.weight}>
                        <Typography uppercase light weight="medium" size="sm">
                            {token0Symbol}
                        </Typography>
                        <Typography uppercase weight="medium" size="sm">
                            {formatPercentage({
                                percentage: weighting?.token0,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.weight}>
                        <Typography uppercase light weight="medium" size="sm">
                            {token1Symbol}
                        </Typography>
                        <Typography uppercase weight="medium" size="sm">
                            {formatPercentage({
                                percentage: weighting?.token1,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.weight}>
                        <Typography uppercase light weight="medium" size="sm">
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

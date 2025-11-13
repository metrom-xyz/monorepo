import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from "react";
import {
    Typography,
    ErrorText,
    Switch,
    Button,
    SliderInput,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import {
    type AaveV3CampaignPayloadPart,
    type CampaignPayloadErrors,
} from "@/src/types/campaign";
import type { LocalizedMessage } from "@/src/types/utils";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { usePrevious } from "react-use";
import { InfoMessage } from "@/src/components/info-message";
import numeral from "numeral";
import { DEFAULT_BOOST } from "../../form/aave-v3-bridge-and-supply-form";

import styles from "./styles.module.css";

interface AaveV3BridgeAndSupplyBoostStepProps {
    disabled?: boolean;
    boostingFactor?: number;
    onBoostingFactorChange: (boostingFactor: AaveV3CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.aaveV3.boost">;

export function AaveV3BridgeAndSupplyBoostStep({
    disabled,
    boostingFactor,
    onBoostingFactorChange,
    onError,
}: AaveV3BridgeAndSupplyBoostStepProps) {
    const t = useTranslations("newCampaign.form.aaveV3.boost");

    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [warning, setWarning] = useState<ErrorMessage>("");
    const [boost, setBoost] = useState<number>(boostingFactor || DEFAULT_BOOST);

    const { id: chainId } = useChainWithType();
    const prevBoost = usePrevious(boostingFactor);

    const unsavedChanges = useMemo(() => {
        return !prevBoost || prevBoost !== boost;
    }, [prevBoost, boost]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    useEffect(() => {
        if (enabled && !open && unsavedChanges)
            setWarning("warnings.notApplied");
        else setWarning("");
    }, [enabled, open, unsavedChanges]);

    useEffect(() => {
        onError({
            boostingFactor: enabled && !boostingFactor,
        });
    }, [enabled, boostingFactor, onError]);

    // this hooks is used to disable and close the step when
    // the boosting factor gets disabled, after the campaign creation
    useEffect(() => {
        if (enabled && !!prevBoost && !boostingFactor) setEnabled(false);
    }, [enabled, prevBoost, boostingFactor]);

    // reset state once the step gets disabled
    useEffect(() => {
        if (enabled) return;
        if (boostingFactor)
            onBoostingFactorChange({ boostingFactor: DEFAULT_BOOST });

        setBoost(DEFAULT_BOOST);
    }, [enabled, boostingFactor, onBoostingFactorChange]);

    function handleSwitchOnClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        setOpen((open) => !open);
    }

    function handleBoostOnChange(event: ChangeEvent<HTMLInputElement>) {
        setBoost(Number(event.target.value) / 100);
    }

    const handleApply = useCallback(() => {
        setOpen(false);
        onBoostingFactorChange({
            boostingFactor: boost,
        });
    }, [boost, onBoostingFactorChange]);

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
                                {warning ? t(warning) : null}
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
                <div className={styles.boostWrapper}>
                    <Typography weight="medium" size="sm" uppercase>
                        {t("factor", {
                            boostingFactor: `${numeral(boost * 100).format("0.0")}x`,
                        })}
                    </Typography>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <InfoMessage
                        text={t.rich("infoMessage", {
                            bold: (chunks) => (
                                <span className={styles.boldText}>
                                    {chunks}
                                </span>
                            ),
                        })}
                    />
                    <SliderInput
                        label={t("boostingFactor")}
                        min={1}
                        max={5}
                        step={0.1}
                        value={boost * 100}
                        formattedValue={`${numeral(boost * 100).format("0.0")}x`}
                        onChange={handleBoostOnChange}
                        className={styles.minimumPayoutSlider}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!unsavedChanges}
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

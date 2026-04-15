import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FunctionComponent,
} from "react";
import type {
    BaseCampaignPayload,
    BaseCampaignPayloadPart,
} from "@/src/types/campaign/common";
import { StepSection } from "../../form/step-section";
import { Button, Skeleton, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { formatUsdAmount } from "@/src/utils/format";
import { useFormSteps, type FormSteps } from "@/src/context/form-steps";
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";
import type { SVGIcon } from "@/src/types/common";
import { KpiPresets, KpiPresetType } from "./presets";
import type { TranslationsKeys } from "@/src/types/utils";
import { TraditionalRewardIcon } from "@/src/assets/traditional-reward-icon";
import { CappedRewardRateIcon } from "@/src/assets/capped-reward-rate-icon";
import { IncreasingAprIcon } from "@/src/assets/increasing-apr-icon";
import { CustomRewardRateIcon } from "@/src/assets/custom-reward-rate-icon";
import { BoldText } from "@/src/components/bold-text";
import { GoalInputs } from "./goal-inputs";
import { FormStepId } from "@/src/types/form";

import styles from "./styles.module.css";

interface CampaignkPIStepProps {
    payload: BaseCampaignPayload;
    loadingTargetUsdValue?: boolean;
    targetUsdValue?: number;
    disabled?: boolean;
    completed?: boolean;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

interface KpiPreset {
    icon: FunctionComponent<SVGIcon>;
    title: TranslationsKeys<"newCampaign.form.kpi.presets">;
    description: TranslationsKeys<"newCampaign.form.kpi.presets">;
    setLowerBound: (targetUsdValue: number) => number | undefined;
    setUpperBound: (targetUsdValue: number) => number | undefined;
    minimumPayoutPercentage?: number;
}

export const KPI_PRESETS: Record<KpiPresetType, KpiPreset> = {
    [KpiPresetType.TraditionalReward]: {
        icon: TraditionalRewardIcon,
        title: "traditionalReward.title",
        description: "traditionalReward.description",
        setLowerBound: () => 0,
        setUpperBound: (targetUsdValue) => targetUsdValue * 2,
        minimumPayoutPercentage: 60,
    },
    [KpiPresetType.CappedRewardRate]: {
        icon: CappedRewardRateIcon,
        title: "cappedRewardRate.title",
        description: "cappedRewardRate.description",
        setLowerBound: () => 0,
        setUpperBound: (targetUsdValue) => targetUsdValue * 2,
        minimumPayoutPercentage: 0,
    },
    [KpiPresetType.IncreasingApr]: {
        icon: IncreasingAprIcon,
        title: "increasingApr.title",
        description: "increasingApr.description",
        setLowerBound: (targetUsdValue) => targetUsdValue / 2,
        setUpperBound: (targetUsdValue) => targetUsdValue * 1.5,
        minimumPayoutPercentage: 20,
    },
    [KpiPresetType.CustomRewardRate]: {
        icon: CustomRewardRateIcon,
        title: "customReward.title",
        description: "customReward.description",
        setLowerBound: () => undefined,
        setUpperBound: () => undefined,
        minimumPayoutPercentage: undefined,
    },
};

export function CampaignKpiStep({
    payload,
    loadingTargetUsdValue,
    targetUsdValue,
    disabled,
    completed,
    onApply,
}: CampaignkPIStepProps) {
    const [open, setOpen] = useState(false);
    const [preset, setPreset] = useState<KpiPresetType>(
        KpiPresetType.TraditionalReward,
    );
    // FIXME: use new defined type once fixed APR PR is merged
    const [specificationPayload, setSpecificationPayload] = useState({});

    const t = useTranslations("newCampaign.form.kpi");
    const { errors, activeStepId, updateErrors } = useFormSteps();
    const targetValueName = useCampaignTargetValueName({ kind: payload.kind });

    const unsavedChanges = useMemo(() => {
        // TODO: implement
        return false;
    }, []);

    useEffect(() => {
        setOpen(activeStepId === FormStepId.Kpi);
    }, [activeStepId]);

    const handleOnApply = useCallback(() => {
        onApply(payload, FormStepId.Kpi);
        setOpen(false);
    }, [payload, onApply]);

    const handleOnSkip = useCallback(() => {
        // TODO: implement
        // onApply({ ... });
        // setSpecificationPayload({...});
        setOpen(false);
    }, []);

    const handleOnError = useCallback(
        (errors: FormSteps<string>) => {
            updateErrors(errors);
        },
        [updateErrors],
    );

    function handlePayloadOnChange(part: BaseCampaignPayloadPart) {
        setSpecificationPayload((prev) => ({ ...prev, ...part }));
    }

    // const applyDisabled =
    //     !!errors.rewards ||
    //     !unsavedChanges ||
    //     !distributablesCompleted(rewardsPayload);

    // const completed =
    //     !errors.rewards &&
    //     !unsavedChanges &&
    //     distributablesCompleted(rewardsPayload);

    return (
        <FormStep
            title={t("title")}
            open={open}
            optional
            disabled={disabled}
            // completed={completed}
            error={errors.kpi}
            warning={
                !errors.kpi && !open && unsavedChanges
                    ? t("notSaved")
                    : undefined
            }
            onToggle={setOpen}
            className={styles.root}
        >
            <StepSection
                title={t("defineStrategy")}
                description={
                    <Typography size="xs" variant="tertiary">
                        {t.rich("infoMessage", {
                            targetValueName,
                            bold: (chunks) => <BoldText>{chunks}</BoldText>,
                        })}
                    </Typography>
                }
            >
                <KpiPresets
                    targetValueName={targetValueName}
                    value={preset}
                    onChange={setPreset}
                />
            </StepSection>
            <StepSection
                title={t("defineParameters")}
                description={
                    <Typography size="xs" variant="tertiary">
                        {t("defaultValues")}
                    </Typography>
                }
                headerDecorator={
                    <div className={styles.targetChip}>
                        <Typography size="xs" weight="medium" uppercase>
                            {t("currentTarget", { targetValueName })}
                        </Typography>
                        {loadingTargetUsdValue ? (
                            <Skeleton width={50} size="sm" />
                        ) : (
                            <Typography weight="medium" size="xs" uppercase>
                                {formatUsdAmount({ amount: targetUsdValue })}
                            </Typography>
                        )}
                    </div>
                }
            >
                <GoalInputs onChange={handlePayloadOnChange} />
            </StepSection>
            <div className={styles.buttons}>
                <Button
                    onClick={handleOnApply}
                    icon={ArrowRightIcon}
                    disabled={disabled}
                    // applyDisabled
                    className={{ root: styles.button }}
                >
                    {t("saveKpi")}
                </Button>
                <Button
                    onClick={handleOnSkip}
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    disabled={disabled}
                    variant="secondary"
                    className={{ root: styles.button }}
                >
                    {t("skipKpi")}
                </Button>
            </div>
        </FormStep>
    );
}

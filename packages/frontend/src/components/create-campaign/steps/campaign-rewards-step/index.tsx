import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type {
    BaseCampaignPayload,
    BaseCampaignPayloadPart,
} from "@/src/types/campaign/common";
import { StepSection } from "../../form/step-section";
import { Button, Skeleton, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { RewardsPicker } from "../../inputs/rewards-picker";
import type { Dayjs } from "dayjs";
import {
    useFormValidation,
    type FormSteps,
} from "@/src/context/form-validation";
import { RestrictionsPicker } from "../../inputs/restrictions-picker";
import { InfoMessage } from "@/src/components/info-message";
import { useFormSteps } from "@/src/context/form-steps";

import styles from "./styles.module.css";

interface CampaignRewardsStepProps {
    stepNumber: number;
    chainId?: number;
    startDate?: Dayjs;
    endDate?: Dayjs;
    payload: Pick<BaseCampaignPayload, "distributables" | "restrictions">;
    apr?: number;
    loadingApr?: boolean;
    additionalSection?: ReactNode;
    applyDisabled?: boolean;
    completed?: boolean;
    disabled?: boolean;
    unsavedChanges?: boolean;
    onChange: (payload: BaseCampaignPayloadPart) => void;
    onApply: (payload: BaseCampaignPayloadPart) => void;
}

export function CampaignRewardsStep({
    stepNumber,
    chainId,
    startDate,
    endDate,
    payload,
    apr,
    loadingApr,
    additionalSection,
    applyDisabled,
    completed,
    disabled,
    unsavedChanges,
    onChange,
    onApply,
}: CampaignRewardsStepProps) {
    const [open, setOpen] = useState(false);

    const t = useTranslations("newCampaign.form.rewards");
    const { errors, updateErrors, updateUnsaved } = useFormValidation();
    const { cursor, setCursor } = useFormSteps();

    useEffect(() => {
        if (completed || disabled) return;
        setOpen(cursor === stepNumber);
    }, [completed, disabled, cursor, stepNumber]);

    useEffect(() => {
        updateUnsaved({ basics: unsavedChanges });
    }, [unsavedChanges, updateUnsaved]);

    const campaignDuration = useMemo(() => {
        if (!startDate || !endDate) return undefined;
        return endDate.diff(startDate, "seconds");
    }, [endDate, startDate]);

    const handleOnApply = useCallback(() => {
        onApply(payload);
        setOpen(false);
        setCursor(stepNumber + 1);
    }, [payload, stepNumber, onApply, setCursor]);

    const handleOnError = useCallback(
        (errors: FormSteps<string>) => {
            updateErrors(errors);
        },
        [updateErrors],
    );

    return (
        <FormStep
            title={t("title")}
            open={open}
            disabled={disabled}
            completed={completed}
            error={errors.rewards}
            warning={
                !errors.rewards && !open && unsavedChanges
                    ? t("notSaved")
                    : undefined
            }
            onToggle={setOpen}
            className={styles.root}
        >
            <StepSection
                title={t("defineAssets")}
                headerDecorator={
                    <div
                        className={classNames(styles.aprChip, {
                            [styles.noApr]: apr === undefined,
                        })}
                    >
                        {loadingApr ? (
                            <Skeleton size="xs" className={styles.loadingApr} />
                        ) : (
                            <Typography size="xs" weight="medium">
                                {t("apr", {
                                    apr:
                                        apr !== undefined
                                            ? formatPercentage({
                                                  percentage: apr,
                                              })
                                            : "-",
                                })}
                            </Typography>
                        )}
                    </div>
                }
            >
                <RewardsPicker
                    chainId={chainId}
                    campaignDuration={campaignDuration}
                    value={payload.distributables}
                    onChange={onChange}
                    onError={handleOnError}
                />
            </StepSection>
            {additionalSection}
            <StepSection
                optional
                title={t("defineRestrictions")}
                description={
                    <InfoMessage
                        weight="regular"
                        text={t("defineRestrictionDescription")}
                        link="https://docs.metrom.xyz/creating-a-campaign/address-restrictions"
                    />
                }
            >
                <RestrictionsPicker
                    value={payload.restrictions}
                    onChange={onChange}
                />
            </StepSection>
            <Button
                onClick={handleOnApply}
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={disabled || applyDisabled}
                className={{ root: styles.button }}
            >
                {t("saveRewards")}
            </Button>
        </FormStep>
    );
}

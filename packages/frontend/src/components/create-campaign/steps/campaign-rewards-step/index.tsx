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
import { Button, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { RewardsPicker } from "../../inputs/rewards-picker";
import type { Dayjs } from "dayjs";
import type { CompletedRequiredSteps } from "../../form";
import { useFormErrors, type FormErrors } from "@/src/context/form-errors";
import { RestrictionsPicker } from "../../inputs/restrictions-picker";

import styles from "./styles.module.css";

interface CampaignRewardsStepProps {
    chainId?: number;
    startDate?: Dayjs;
    endDate?: Dayjs;
    payload: BaseCampaignPayload;
    apr?: number;
    initialOpen?: boolean;
    additionalSection?: ReactNode;
    applyDisabled?: boolean;
    completed?: boolean;
    disabled?: boolean;
    unsavedChanges?: boolean;
    onComplete: (steps: Partial<CompletedRequiredSteps>) => void;
    onChange: (payload: BaseCampaignPayloadPart) => void;
    onApply: (payload: BaseCampaignPayloadPart) => void;
}

export function CampaignRewardsStep({
    chainId,
    startDate,
    endDate,
    payload,
    apr,
    initialOpen,
    additionalSection,
    applyDisabled,
    completed,
    disabled,
    unsavedChanges,
    onComplete,
    onChange,
    onApply,
}: CampaignRewardsStepProps) {
    const [open, setOpen] = useState(initialOpen || false);

    const t = useTranslations("newCampaign.form.rewards");
    const { errors, updateErrors } = useFormErrors();

    const campaignDuration = useMemo(() => {
        if (!startDate || !endDate) return undefined;
        return endDate.diff(startDate, "seconds");
    }, [endDate, startDate]);

    useEffect(() => {
        if (disabled) return;
        setOpen(true);
    }, [disabled]);

    const handleOnApply = useCallback(() => {
        onApply(payload);
        setOpen(false);
        onComplete({ rewards: true });
    }, [payload, onApply, onComplete]);

    const handleOnError = useCallback(
        (errors: FormErrors) => {
            updateErrors(errors);
            onComplete({ rewards: false });
        },
        [onComplete, updateErrors],
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
                        <Typography size="xs" weight="medium">
                            {t("apr", {
                                apr:
                                    apr !== undefined
                                        ? formatPercentage({ percentage: apr })
                                        : "-",
                            })}
                        </Typography>
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
                title={t("defineRestrictions")}
                description={t("defineRestrictionDescription")}
                optional
            >
                <RestrictionsPicker
                    value={payload.restrictions}
                    onChange={onChange}
                />
            </StepSection>
            <Button
                onClick={handleOnApply}
                icon={ArrowRightIcon}
                disabled={disabled || applyDisabled}
                className={{ root: styles.button }}
            >
                {t("saveRewards")}
            </Button>
        </FormStep>
    );
}

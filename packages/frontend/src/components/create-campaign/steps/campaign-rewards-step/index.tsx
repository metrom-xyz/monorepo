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
    CampaignPayloadKpiDistribution,
} from "@/src/types/campaign/common";
import { FormStepSection } from "../../form-step-section";
import { Button, Skeleton, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { RewardsPicker } from "../../inputs/rewards-picker";
import type { Dayjs } from "dayjs";
import { useFormSteps, type FormSteps } from "@/src/context/form-steps";
import { RestrictionsPicker } from "../../inputs/restrictions-picker";
import { InfoMessage } from "@/src/components/info-message";
import { FormStepId } from "@/src/types/form";
import { FixedAprPicker } from "../../inputs/fixed-apr-picker";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { DistributablesType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface CampaignRewardsStepProps {
    chainId?: number;
    startDate?: Dayjs;
    endDate?: Dayjs;
    kpiDistribution?: CampaignPayloadKpiDistribution;
    payload: Pick<
        BaseCampaignPayload,
        "distributables" | "restrictions" | "fixedDistribution"
    > &
        Pick<AmmPoolLiquidityCampaignPayload, "weighting">;
    apr?: number;
    loadingApr?: boolean;
    additionalSection?: ReactNode;
    applyDisabled?: boolean;
    completed?: boolean;
    disabled?: boolean;
    unsavedChanges?: boolean;
    onChange: (payload: BaseCampaignPayloadPart) => void;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

export function CampaignRewardsStep({
    chainId,
    startDate,
    endDate,
    kpiDistribution,
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
    const [applied, setApplied] = useState(false);

    const t = useTranslations("newCampaign.form.rewards");
    const { errors, activeStepId, updateErrors, updateUnsaved } =
        useFormSteps();

    useEffect(() => {
        if (applied || completed) return;
        setOpen(activeStepId === FormStepId.Rewards);
    }, [applied, completed, activeStepId]);

    useEffect(() => {
        updateUnsaved({ basics: unsavedChanges });
    }, [unsavedChanges, updateUnsaved]);

    const campaignDuration = useMemo(() => {
        if (!startDate || !endDate) return undefined;
        return endDate.diff(startDate, "seconds");
    }, [endDate, startDate]);

    const handleOnApply = useCallback(() => {
        onApply(payload, FormStepId.Rewards);
        setApplied(true);
        setOpen(false);
    }, [payload, onApply]);

    const handleOnError = useCallback(
        (errors: FormSteps<string>) => {
            updateErrors(errors);
        },
        [updateErrors],
    );

    const derivedApr = payload.fixedDistribution?.apr || apr;

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
            <FormStepSection
                title={t("defineAssets")}
                headerDecorator={
                    payload.distributables?.type ===
                    DistributablesType.Tokens ? (
                        <div
                            className={classNames(styles.aprChip, {
                                [styles.noApr]: derivedApr === undefined,
                            })}
                        >
                            {loadingApr ? (
                                <Skeleton
                                    size="xs"
                                    className={styles.loadingApr}
                                />
                            ) : (
                                <Typography size="xs" weight="medium">
                                    {t("apr", {
                                        apr:
                                            derivedApr !== undefined
                                                ? formatPercentage({
                                                      percentage: derivedApr,
                                                  })
                                                : "-",
                                    })}
                                </Typography>
                            )}
                        </div>
                    ) : undefined
                }
            >
                <RewardsPicker
                    chainId={chainId}
                    campaignDuration={campaignDuration}
                    value={payload.distributables}
                    onChange={onChange}
                    onError={handleOnError}
                />
            </FormStepSection>
            {!kpiDistribution &&
                payload.distributables?.type === DistributablesType.Tokens && (
                    <FormStepSection
                        title={t("fixedApr")}
                        description={
                            <InfoMessage
                                weight="regular"
                                text={t("fixedAprDescription")}
                            />
                        }
                        optional
                    >
                        <FixedAprPicker
                            chainId={chainId}
                            startDate={startDate}
                            endDate={endDate}
                            value={payload.fixedDistribution}
                            onChange={onChange}
                        />
                    </FormStepSection>
                )}
            {additionalSection}
            <FormStepSection
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
            </FormStepSection>
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

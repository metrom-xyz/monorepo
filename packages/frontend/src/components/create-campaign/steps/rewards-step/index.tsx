import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography, ErrorText, Tabs, Tab } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import {
    type BaseCampaignPayload,
    type BaseCampaignPayloadPart,
    type CampaignPayloadErrors,
} from "@/src/types/common";
import classNames from "classnames";
import { RewardTokens } from "./tokens";
import { RewardPoints } from "./points";
import { DistributablesType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface RewardsStepProps {
    disabled?: boolean;
    distributables?: BaseCampaignPayload["distributables"];
    startDate?: BaseCampaignPayload["startDate"];
    endDate?: BaseCampaignPayload["endDate"];
    onDistributablesChange: (rewards: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function RewardsStep({
    disabled,
    distributables,
    startDate,
    endDate,
    onDistributablesChange,
    onError,
}: RewardsStepProps) {
    const t = useTranslations("newCampaign.form.base.rewards");
    const [error, setError] = useState("");

    const campaignDuration = useMemo(() => {
        if (!startDate || !endDate) return undefined;
        return endDate.diff(startDate, "seconds");
    }, [endDate, startDate]);

    const handleOnError = useCallback(
        (errors: CampaignPayloadErrors, message?: string) => {
            onError(errors);
            setError(message || "");
        },
        [onError],
    );

    const handleOnRewardTypeSwitch = useCallback(
        (type: DistributablesType) => {
            onDistributablesChange({
                distributables: {
                    type,
                },
            });
        },
        [onDistributablesChange],
    );

    return (
        <Step
            disabled={disabled}
            completed={!disabled}
            open
            className={styles.step}
        >
            <StepPreview
                label={
                    <div
                        className={classNames(styles.previewLabelWrapper, {
                            [styles.disabled]: disabled,
                        })}
                    >
                        <div className={styles.previewTextWrapper}>
                            <Typography
                                uppercase
                                weight="medium"
                                size="sm"
                                className={styles.previewLabel}
                            >
                                {t("title.rewards")}
                            </Typography>
                            <ErrorText size="xs" weight="medium">
                                {!disabled ? error : null}
                            </ErrorText>
                        </div>
                        <Tabs
                            size="sm"
                            value={distributables?.type}
                            onChange={handleOnRewardTypeSwitch}
                        >
                            <Tab
                                value={DistributablesType.Tokens}
                                className={classNames(styles.tab, {
                                    [styles.activeTab]:
                                        distributables?.type ===
                                        DistributablesType.Tokens,
                                })}
                            >
                                <Typography weight="medium" size="sm">
                                    {t("tabs.tokens")}
                                </Typography>
                            </Tab>
                            <Tab
                                value={DistributablesType.Points}
                                className={classNames(styles.tab, {
                                    [styles.activeTab]:
                                        distributables?.type ===
                                        DistributablesType.Points,
                                })}
                            >
                                <Typography weight="medium" size="sm">
                                    {t("tabs.points")}
                                </Typography>
                            </Tab>
                        </Tabs>
                    </div>
                }
                decorator={false}
                className={{ root: !disabled ? styles.stepPreview : "" }}
            >
                <div className={styles.previewWrapper}>
                    {distributables?.type === DistributablesType.Points && (
                        <RewardPoints
                            campaignDuration={campaignDuration}
                            distributables={distributables}
                            onError={handleOnError}
                            onPointsChange={onDistributablesChange}
                        />
                    )}
                    {distributables?.type === DistributablesType.Tokens && (
                        <RewardTokens
                            campaignDuration={campaignDuration}
                            distributables={distributables}
                            onError={handleOnError}
                            onTokensChange={onDistributablesChange}
                        />
                    )}
                </div>
            </StepPreview>
            <StepContent></StepContent>
        </Step>
    );
}

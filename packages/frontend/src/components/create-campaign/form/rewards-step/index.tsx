import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography, ErrorText, Tabs, Tab } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import {
    type CampaignPayload,
    type CampaignPayloadPart,
    type CampaignPayloadErrors,
    RewardType,
} from "@/src/types";
import classNames from "classnames";
import { RewardTokens } from "./tokens";
import { RewardPoints } from "./points";

import styles from "./styles.module.css";

interface RewardsStepProps {
    disabled?: boolean;
    pool?: CampaignPayload["pool"];
    rewardType?: CampaignPayload["rewardType"];
    tokens?: CampaignPayload["tokens"];
    points?: CampaignPayload["points"];
    feeToken?: CampaignPayload["feeToken"];
    startDate?: CampaignPayload["startDate"];
    endDate?: CampaignPayload["endDate"];
    onRewardsChange: (rewards: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function RewardsStep({
    disabled,
    pool,
    rewardType,
    tokens,
    points,
    feeToken,
    startDate,
    endDate,
    onRewardsChange,
    onError,
}: RewardsStepProps) {
    const t = useTranslations("newCampaign.form.rewards");
    const [type, setType] = useState(rewardType || RewardType.tokens);
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

    useEffect(() => {
        if (rewardType) return;
        onRewardsChange({ rewardType: RewardType.tokens });
    }, [rewardType, onRewardsChange]);

    useEffect(() => {
        if (pool) return;
        setType(RewardType.tokens);
    }, [pool]);

    const handleOnRewardTypeSwitch = useCallback(
        (type: RewardType) => {
            setType(type);
            onRewardsChange({
                rewardType: type,
                tokens: undefined,
                points: undefined,
                feeToken: undefined,
            });
        },
        [onRewardsChange],
    );

    return (
        <Step
            disabled={disabled}
            completed={!disabled}
            error={!!error}
            className={styles.step}
        >
            <StepPreview
                label={
                    <div
                        className={classNames(styles.previewLabelWrapper, {
                            [styles.disabled]: disabled,
                        })}
                    >
                        <Typography
                            uppercase
                            weight="medium"
                            size="sm"
                            className={styles.previewLabel}
                        >
                            {t("title.rewards")}
                        </Typography>
                        <ErrorText
                            size="xs"
                            weight="medium"
                            className={classNames(styles.error, {
                                [styles.errorVisible]: !!error,
                            })}
                        >
                            {error}
                        </ErrorText>
                    </div>
                }
                decorator={disabled}
                className={{ root: !disabled ? styles.stepPreview : "" }}
            >
                <div className={styles.previewWrapper}>
                    <div className="px-4">
                        <Tabs
                            size="sm"
                            value={type}
                            onChange={handleOnRewardTypeSwitch}
                        >
                            <Tab value={RewardType.tokens}>
                                <div className={styles.tab}>
                                    <Typography weight="medium">
                                        {t("tabs.tokens")}
                                    </Typography>
                                </div>
                            </Tab>
                            <Tab value={RewardType.points}>
                                <div className={styles.tab}>
                                    <Typography weight="medium">
                                        {t("tabs.points")}
                                    </Typography>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    {type === RewardType.points && (
                        <RewardPoints
                            campaignDuration={campaignDuration}
                            points={points}
                            feeToken={feeToken}
                            onError={handleOnError}
                            onPointsChange={onRewardsChange}
                        />
                    )}
                    {type === RewardType.tokens && (
                        <RewardTokens
                            campaignDuration={campaignDuration}
                            tokens={tokens}
                            onError={handleOnError}
                            onTokensChange={onRewardsChange}
                        />
                    )}
                </div>
            </StepPreview>
            <StepContent></StepContent>
        </Step>
    );
}

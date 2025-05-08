import { useCallback, useMemo, useState } from "react";
import { Typography, ErrorText, Tabs, Tab, Switch } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import {
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
    type BaseCampaignPayload,
    type BaseCampaignPayloadPart,
    type CampaignPayloadErrors,
} from "@/src/types/campaign";
import classNames from "classnames";
import { RewardTokens } from "./tokens";
import { RewardPoints } from "./points";
import { DistributablesType } from "@metrom-xyz/sdk";
import { Weighting } from "./weighting";
import { AMM_SUPPORTS_TOKENS_RATIO } from "@/src/commons";
import type { SupportedAmm } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface RewardsStepProps {
    disabled?: boolean;
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    weighting?: AmmPoolLiquidityCampaignPayload["weighting"];
    distributables?: BaseCampaignPayload["distributables"];
    startDate?: BaseCampaignPayload["startDate"];
    endDate?: BaseCampaignPayload["endDate"];
    onDistributablesChange: (rewards: BaseCampaignPayloadPart) => void;
    onWeightingChange?: (
        weighting: AmmPoolLiquidityCampaignPayloadPart,
    ) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function RewardsStep({
    disabled,
    pool,
    weighting,
    distributables,
    startDate,
    endDate,
    onDistributablesChange,
    onWeightingChange,
    onError,
}: RewardsStepProps) {
    const t = useTranslations("newCampaign.form.base.rewards");
    const [error, setError] = useState("");
    const [tokensRatioOpen, setTokensRatioOpen] = useState(false);

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

    const tokensRatioSupported = useMemo(() => {
        return (
            !!pool &&
            !disabled &&
            !!onWeightingChange &&
            AMM_SUPPORTS_TOKENS_RATIO[pool.amm as SupportedAmm]
        );
    }, [pool, disabled, onWeightingChange]);

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
                        <div className={styles.topRightContent}>
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
                            {tokensRatioSupported && (
                                <div className={styles.tokensRatioToggle}>
                                    <Typography
                                        uppercase
                                        weight="medium"
                                        light
                                        size="xs"
                                    >
                                        {t("weighting.title")}:
                                    </Typography>
                                    <Switch
                                        size="xs"
                                        checked={tokensRatioOpen}
                                        onClick={setTokensRatioOpen}
                                    />
                                </div>
                            )}
                        </div>
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
                    {tokensRatioSupported && (
                        <div className={styles.tokensRatioWrapper}>
                            <Weighting
                                open={tokensRatioOpen}
                                pool={pool}
                                weighting={weighting}
                                onWeightingChange={onWeightingChange!}
                            />
                        </div>
                    )}
                </div>
            </StepPreview>
            <StepContent></StepContent>
        </Step>
    );
}

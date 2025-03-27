import { useCallback, useEffect, useMemo, useState } from "react";
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
    RewardType,
} from "@/src/types/common";
import classNames from "classnames";
import { RewardTokens } from "./tokens";
import { RewardPoints } from "./points";
import { TokensRatio } from "./tokens-ratio";

import styles from "./styles.module.css";
import { AMM_SUPPORTS_TOKENS_RATIO } from "@/src/commons";
import type { SupportedAmm } from "@metrom-xyz/sdk";

interface RewardsStepProps {
    disabled?: boolean;
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    tokensRatio?: AmmPoolLiquidityCampaignPayload["tokensRatio"];
    rewardType?: BaseCampaignPayload["rewardType"];
    tokens?: BaseCampaignPayload["tokens"];
    points?: BaseCampaignPayload["points"];
    fee?: BaseCampaignPayload["fee"];
    startDate?: BaseCampaignPayload["startDate"];
    endDate?: BaseCampaignPayload["endDate"];
    onRewardsChange: (rewards: BaseCampaignPayloadPart) => void;
    onTokensRatioChange?: (
        tokensRatio: AmmPoolLiquidityCampaignPayloadPart,
    ) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function RewardsStep({
    disabled,
    pool,
    tokensRatio,
    rewardType,
    tokens,
    points,
    fee,
    startDate,
    endDate,
    onRewardsChange,
    onTokensRatioChange,
    onError,
}: RewardsStepProps) {
    const t = useTranslations("newCampaign.form.base.rewards");
    const [type, setType] = useState(rewardType || RewardType.Tokens);
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

    useEffect(() => {
        if (rewardType) return;
        onRewardsChange({ rewardType: RewardType.Tokens });
    }, [rewardType, onRewardsChange]);

    const handleOnRewardTypeSwitch = useCallback(
        (type: RewardType) => {
            setType(type);
            onRewardsChange({
                rewardType: type,
                tokens: undefined,
                points: undefined,
                fee: undefined,
                kpiSpecification: undefined,
            });
        },
        [onRewardsChange],
    );

    const tokensRatioSupported = useMemo(() => {
        return (
            !!pool &&
            !disabled &&
            !!onTokensRatioChange &&
            AMM_SUPPORTS_TOKENS_RATIO[pool.amm as SupportedAmm]
        );
    }, [pool, disabled, onTokensRatioChange]);

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
                                value={type}
                                onChange={handleOnRewardTypeSwitch}
                                className={styles.tabs}
                            >
                                <Tab
                                    value={RewardType.Tokens}
                                    className={classNames(styles.tab, {
                                        [styles.activeTab]:
                                            type === RewardType.Tokens,
                                    })}
                                >
                                    <Typography weight="medium" size="sm">
                                        {t("tabs.tokens")}
                                    </Typography>
                                </Tab>
                                <Tab
                                    value={RewardType.Points}
                                    className={classNames(styles.tab, {
                                        [styles.activeTab]:
                                            type === RewardType.Points,
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
                                        {t("tokensRatio.title")}:
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
                    {type === RewardType.Points && (
                        <RewardPoints
                            campaignDuration={campaignDuration}
                            points={points}
                            fee={fee}
                            onError={handleOnError}
                            onPointsChange={onRewardsChange}
                        />
                    )}
                    {type === RewardType.Tokens && (
                        <RewardTokens
                            campaignDuration={campaignDuration}
                            tokens={tokens}
                            onError={handleOnError}
                            onTokensChange={onRewardsChange}
                        />
                    )}
                    {tokensRatioSupported && (
                        <div className={styles.tokensRatioWrapper}>
                            <TokensRatio
                                open={tokensRatioOpen}
                                pool={pool}
                                tokensRatio={tokensRatio}
                                onTokensRatioChange={onTokensRatioChange!}
                            />
                        </div>
                    )}
                </div>
            </StepPreview>
            <StepContent></StepContent>
        </Step>
    );
}

"use client";

import { type CampaignPayload } from "@/src/types/campaign/common";
import {
    BaseCampaignType,
    CampaignKind,
    DistributablesType,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import { useCallback, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { Button, Typography } from "@metrom-xyz/ui";
import { FormHeader } from "./header";
import { AmmPoolLiquidityForm } from "./amm-pool-liquidity-form";
import { LiquityV2ForksForm } from "./liquity-v2-forks-form";
import { useRouter } from "@/src/i18n/routing";
import { AaveV3Form } from "./aave-v3-form";
import { AaveV3BridgeAndSupplyForm } from "./aave-v3-bridge-and-supply-form";
import { HoldFungibleAssetForm } from "./hold-fungible-asset-form";
import { FormPreview } from "./preview";
import { ArrowLeftIcon } from "@/src/assets/arrow-left-icon";
import { useTranslations } from "next-intl";
import { FormStepsProvider } from "@/src/context/form-steps";
import { CheckIcon } from "@/src/assets/check-icon";
import { SAFE } from "@/src/commons/env";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import { useForms } from "@/src/hooks/useForms";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { FormNotSupported } from "../form-not-supported";

import styles from "./styles.module.css";

export interface CreateCampaignFormProps<T> {
    campaignType: T;
    distributablesType: DistributablesType;
}

export function CreateCampaignForm<T extends CampaignType>({
    campaignType,
    distributablesType,
}: CreateCampaignFormProps<T>) {
    const [launched, setLaunched] = useState(false);
    const [payload, setPayload] = useState<CampaignPayload | null>(null);

    const t = useTranslations("newCampaign");
    const { id: chainId } = useChainWithType();
    const router = useRouter();
    const formsByType = useForms({
        chainId,
        type: campaignType,
        partner: false,
    });
    const partnerFormsByType = useForms({
        chainId,
        type: campaignType,
        partner: true,
    });

    function handlePreviewOnClick() {
        trackFathomEvent("CLICK_CAMPAIGN_PREVIEW");
    }

    const handleOnStepComplete = useCallback((part: object | undefined) => {
        setPayload((prev) => ({ ...prev, ...part }));
    }, []);

    function handleCreateNewOnClick() {
        router.push(`/campaigns/create/${campaignType}`);
    }

    function handleBackOnClick() {
        router.push(`/campaigns/create/${campaignType}`);
    }

    function handleOnLaunch() {
        setLaunched(true);
    }

    function handleGoToAllCampaigns() {
        router.push("/");
    }

    const supportedByType = [...formsByType, ...partnerFormsByType];

    if (supportedByType.length === 0)
        return <FormNotSupported type={campaignType} chainId={chainId} />;

    return (
        <AnimatePresence mode="wait">
            {launched ? (
                <motion.div
                    key="feedback"
                    initial={{ opacity: 0, x: 32, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: easeInOut }}
                    className={styles.launchFeedback}
                >
                    <div className={styles.topContent}>
                        <div className={styles.greenCircle}>
                            <CheckIcon className={styles.checkIcon} />
                        </div>
                        <div className={styles.texts}>
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {t("launchFeedback.congratulations")}
                            </Typography>
                            <Typography size="lg" weight="medium">
                                {SAFE
                                    ? t("launchFeedback.safe.1")
                                    : t("launchFeedback.standard")}
                            </Typography>
                            <Typography size="sm" variant="tertiary">
                                {SAFE
                                    ? t("launchFeedback.safe.2")
                                    : t("launchFeedback.info")}
                            </Typography>
                        </div>
                    </div>
                    <div className={styles.bottomContent}>
                        <Button
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            onClick={handleGoToAllCampaigns}
                            variant="secondary"
                            className={{ root: styles.button }}
                        >
                            {t("launchFeedback.discover")}
                        </Button>
                        <Button
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            onClick={handleCreateNewOnClick}
                            className={{ root: styles.button }}
                        >
                            {t("launchFeedback.newCampaign")}
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="form"
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.1, ease: easeInOut }}
                    className={styles.root}
                >
                    <Button
                        size="sm"
                        variant="secondary"
                        border={false}
                        icon={ArrowLeftIcon}
                        onClick={handleBackOnClick}
                        className={{ root: styles.button }}
                    >
                        {t("back")}
                    </Button>
                    <FormStepsProvider>
                        <div className={styles.content}>
                            <div className={styles.form}>
                                <FormHeader type={campaignType} />
                                {campaignType ===
                                    BaseCampaignType.AmmPoolLiquidity && (
                                    <AmmPoolLiquidityForm
                                        kind={CampaignKind.AmmPoolLiquidity}
                                        distributablesType={distributablesType}
                                        onStepComplete={handleOnStepComplete}
                                        onLaunch={handleOnLaunch}
                                    />
                                )}
                                {campaignType ===
                                    BaseCampaignType.LiquityV2 && (
                                    <LiquityV2ForksForm
                                        distributablesType={distributablesType}
                                        onStepComplete={handleOnStepComplete}
                                        onLaunch={handleOnLaunch}
                                    />
                                )}
                                {campaignType === BaseCampaignType.AaveV3 && (
                                    <AaveV3Form
                                        distributablesType={distributablesType}
                                        onStepComplete={handleOnStepComplete}
                                        onLaunch={handleOnLaunch}
                                    />
                                )}
                                {campaignType ===
                                    BaseCampaignType.HoldFungibleAsset && (
                                    <HoldFungibleAssetForm
                                        distributablesType={distributablesType}
                                        onStepComplete={handleOnStepComplete}
                                        onLaunch={handleOnLaunch}
                                    />
                                )}
                                {campaignType ===
                                    PartnerCampaignType.AaveV3BridgeAndSupply && (
                                    <AaveV3BridgeAndSupplyForm
                                        unsupportedChain={false}
                                        onPreviewClick={handlePreviewOnClick}
                                    />
                                )}
                                {/* {campaignType ===
                        PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity && (
                        <AmmPoolLiquidityForm
                            kind={
                                CampaignKind.JumperWhitelistedAmmPoolLiquidity
                            }
                            unsupportedChain={unsupportedChain}
                            payload={payload}
                            errors={errors}
                            completedRequiredSteps={completedRequiredSteps}
                            onCompleteRequiredStep={
                                handleOnCompletedRequiredStep
                            }
                            onChange={handlePayloadOnChange}
                            onError={handlePayloadOnError}
                            onPreviewClick={handlePreviewOnClick}
                        />
                    )} */}
                            </div>
                            <FormPreview payload={payload} />
                        </div>
                    </FormStepsProvider>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

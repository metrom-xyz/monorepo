"use client";

import {
    type CampaignPayload,
    type CampaignPreviewPayload,
} from "@/src/types/campaign/common";
import {
    BaseCampaignType,
    CampaignKind,
    DistributablesType,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import { useCallback, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { Button, Modal, Typography } from "@metrom-xyz/ui";
import { CampaignPreview } from "../preview";
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

import styles from "./styles.module.css";

enum View {
    Form = "form",
    Preview = "preview",
}

export interface CreateCampaignFormProps<T> {
    campaignType: T;
    distributablesType: DistributablesType;
}

export function CreateCampaignForm<T extends CampaignType>({
    campaignType,
    distributablesType,
}: CreateCampaignFormProps<T>) {
    const [view, setView] = useState(View.Form);
    const [launched, setLaunched] = useState(false);
    // TODO: is this fine? The payload will become the finalized preview instance when confirming the campaign launch
    const [payload, setPayload] = useState<CampaignPayload | null>(null);
    const [previewPayload, setPreviewPayload] =
        useState<CampaignPreviewPayload | null>(null);

    const t = useTranslations("newCampaign");

    // const { chainId: connectedChainId, connected } = useAccount();
    // const { id: selectedChain } = useChainWithType();
    // const activeChains = useActiveChains();
    const router = useRouter();
    // const formsForType = useForms({
    //     chainId: selectedChain,
    //     type: campaignType,
    // });

    function handlePreviewOnClick(payload: CampaignPreviewPayload | null) {
        setPreviewPayload(payload);
        setView(View.Preview);
        trackFathomEvent("CLICK_CAMPAIGN_PREVIEW");
    }

    const handleOnStepComplete = useCallback((part: object | undefined) => {
        setPayload((prev) => ({ ...prev, ...part }));
    }, []);

    function handleCreateNewOnClick() {
        router.push("/campaigns/create");
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

    // const unsupportedChain = useMemo(() => {
    //     return (
    //         connected &&
    //         (!connectedChainId ||
    //             !activeChains.some(({ id }) => id === selectedChain))
    //     );
    // }, [activeChains, connectedChainId, connected, selectedChain]);

    // if (formsForType.length === 0)
    //     return <FormNotSupported type={campaignType} chainId={selectedChain} />;

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
                            onClick={handleOnLaunch}
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
                                        // TODO: remove this?
                                        unsupportedChain={false}
                                        onStepComplete={handleOnStepComplete}
                                        onLaunch={handleOnLaunch}
                                    />
                                )}
                                {campaignType ===
                                    BaseCampaignType.LiquityV2 && (
                                    <LiquityV2ForksForm
                                        unsupportedChain={false}
                                        onPreviewClick={handlePreviewOnClick}
                                    />
                                )}
                                {campaignType === BaseCampaignType.AaveV3 && (
                                    <AaveV3Form
                                        unsupportedChain={false}
                                        distributablesType={distributablesType}
                                        onStepComplete={handleOnStepComplete}
                                        onLaunch={handleOnLaunch}
                                    />
                                )}
                                {campaignType ===
                                    BaseCampaignType.HoldFungibleAsset && (
                                    <HoldFungibleAssetForm
                                        unsupportedChain={false}
                                        onPreviewClick={handlePreviewOnClick}
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
                                {!!previewPayload && (
                                    <Modal open={view === View.Preview}>
                                        <CampaignPreview
                                            onBack={handleBackOnClick}
                                            onCreateNew={handleCreateNewOnClick}
                                            payload={previewPayload}
                                        />
                                    </Modal>
                                )}
                            </div>
                            <FormPreview payload={payload} />
                        </div>
                    </FormStepsProvider>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

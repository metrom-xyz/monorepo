import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useTranslations } from "next-intl";
import {
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
} from "@/src/types";
import { CollateralsList } from "./list";
import { Switch, Typography } from "@metrom-xyz/ui";
import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./styles.module.css";

interface LiquityV2CollateralsStepProps {
    disabled?: boolean;
    action?: LiquityV2CampaignPayload["action"];
    brand?: LiquityV2CampaignPayload["brand"];
    collaterals?: LiquityV2CampaignPayload["collaterals"];
    onCollateralsChange: (value: LiquityV2CampaignPayloadPart) => void;
}

export function LiquityV2CollateralsStep({
    disabled,
    brand,
    collaterals,
    onCollateralsChange,
}: LiquityV2CollateralsStepProps) {
    const t = useTranslations("newCampaign.form.liquityV2.collaterals");

    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);

    const chainId = useChainId();

    useEffect(() => {
        setEnabled(false);
    }, [chainId]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    useEffect(() => {
        if (enabled) return;
        if (collaterals) onCollateralsChange({ collaterals: undefined });
    }, [collaterals, enabled, onCollateralsChange]);

    const handleCollateralsOnAdd = useCallback(
        (newCollateral: LiquityV2Collateral) => {
            const newCollaterals = collaterals
                ? [...collaterals, newCollateral]
                : [newCollateral];

            onCollateralsChange({
                collaterals: newCollaterals,
            });
        },
        [collaterals, onCollateralsChange],
    );

    const handleCollateralsOnRemove = useCallback(
        (removedCollateral: LiquityV2Collateral) => {
            const newCollaterals = collaterals?.filter(
                (collateral) =>
                    collateral.token.address !==
                    removedCollateral.token.address,
            );

            onCollateralsChange({
                collaterals: newCollaterals,
            });
        },
        [collaterals, onCollateralsChange],
    );

    function handleSwitchOnClick() {
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!collaterals && collaterals?.length > 0}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <div className={styles.previewTextWrapper}>
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("title")}
                            </Typography>
                        </div>
                        <Switch
                            tabIndex={-1}
                            size="lg"
                            checked={enabled}
                            onClick={handleSwitchOnClick}
                        />
                    </div>
                }
                decorator={false}
                className={{
                    root: !enabled ? styles.previewDisabled : "",
                }}
            >
                <div className={styles.previewWrapper}>
                    <AnimatePresence>
                        {collaterals?.map((collateral) => (
                            <motion.div
                                key={collateral.token.address}
                                initial="hide"
                                animate="show"
                                exit="hide"
                                variants={{
                                    hide: { opacity: 0 },
                                    show: { opacity: 1 },
                                }}
                                className={styles.collateralLogo}
                            >
                                <RemoteLogo
                                    chain={chainId}
                                    address={collateral.token.address}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.actionsWrapper}>
                    <CollateralsList
                        collaterals={collaterals}
                        brand={brand}
                        onAdd={handleCollateralsOnAdd}
                        onRemove={handleCollateralsOnRemove}
                    />
                </div>
            </StepContent>
        </Step>
    );
}

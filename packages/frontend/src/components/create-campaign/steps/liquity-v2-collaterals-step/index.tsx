import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Button, Switch, Typography } from "@metrom-xyz/ui";
import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { AnimatePresence, motion } from "motion/react";
import { usePrevious } from "react-use";

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
    const [selectedCollaterals, setSelectedCollaterals] = useState<
        LiquityV2Collateral[] | undefined
    >(collaterals);

    const chainId = useChainId();
    const prevCollaterals = usePrevious(collaterals);

    const unsavedChanges = useMemo(() => {
        if (!prevCollaterals) return true;
        return prevCollaterals !== selectedCollaterals;
    }, [selectedCollaterals, prevCollaterals]);

    useEffect(() => {
        setEnabled(false);
    }, [chainId]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    useEffect(() => {
        if (enabled) return;
        if (collaterals) {
            setSelectedCollaterals(undefined);
            onCollateralsChange({ collaterals: undefined });
        }
    }, [collaterals, enabled, onCollateralsChange]);

    const handleCollateralsOnAdd = useCallback(
        (newCollateral: LiquityV2Collateral) => {
            const newCollaterals = selectedCollaterals
                ? [...selectedCollaterals, newCollateral]
                : [newCollateral];

            setSelectedCollaterals(newCollaterals);
        },
        [selectedCollaterals],
    );

    const handleCollateralsOnRemove = useCallback(
        (removedCollateral: LiquityV2Collateral) => {
            const newCollaterals = selectedCollaterals?.filter(
                (collateral) =>
                    collateral.token.address !==
                    removedCollateral.token.address,
            );

            setSelectedCollaterals(newCollaterals);
        },
        [selectedCollaterals],
    );

    const handleCollateralsOnApply = useCallback(() => {
        onCollateralsChange({ collaterals: selectedCollaterals });
        setOpen(false);
    }, [selectedCollaterals, onCollateralsChange]);

    function handleSwitchOnClick() {
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        if (open && !collaterals) setSelectedCollaterals(undefined);
        if (open) setSelectedCollaterals(collaterals);
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!selectedCollaterals && selectedCollaterals?.length > 0}
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
                    <Typography weight="medium" size="sm" uppercase>
                        {t("filters")}
                    </Typography>
                    <div className={styles.collateralsWrapper}>
                        <AnimatePresence>
                            {selectedCollaterals?.map((collateral) => (
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
                                        size="sm"
                                        chain={chainId}
                                        address={collateral.token.address}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.contentWrapper}>
                    <CollateralsList
                        collaterals={selectedCollaterals}
                        brand={brand}
                        onAdd={handleCollateralsOnAdd}
                        onRemove={handleCollateralsOnRemove}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={
                            !unsavedChanges ||
                            !selectedCollaterals ||
                            ((!collaterals || collaterals.length === 0) &&
                                selectedCollaterals.length === 0)
                        }
                        onClick={handleCollateralsOnApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}

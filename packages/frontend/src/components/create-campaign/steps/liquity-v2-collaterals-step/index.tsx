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
    collaterals?: LiquityV2CampaignPayload["filters"];
    supportedCollaterals?: LiquityV2CampaignPayload["supportedCollaterals"];
    onCollateralsChange: (value: LiquityV2CampaignPayloadPart) => void;
}

export function LiquityV2CollateralsStep({
    disabled,
    collaterals,
    supportedCollaterals,
    onCollateralsChange,
}: LiquityV2CollateralsStepProps) {
    const t = useTranslations("newCampaign.form.liquityV2.collaterals");

    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [filteredCollaterals, setFilteredCollaterals] = useState<
        LiquityV2Collateral[] | undefined
    >(collaterals);

    const chainId = useChainId();
    const prevCollaterals = usePrevious(collaterals);

    const unsavedChanges = useMemo(() => {
        if (!prevCollaterals) return true;
        return prevCollaterals !== filteredCollaterals;
    }, [filteredCollaterals, prevCollaterals]);

    useEffect(() => {
        setEnabled(false);
    }, [chainId]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    useEffect(() => {
        if (enabled) return;
        if (collaterals) {
            setFilteredCollaterals(undefined);
            onCollateralsChange({ filters: undefined });
        }
    }, [collaterals, enabled, onCollateralsChange]);

    const handleCollateralsOnAdd = useCallback(
        (newCollateral: LiquityV2Collateral) => {
            const newCollaterals = filteredCollaterals
                ? [...filteredCollaterals, newCollateral]
                : [newCollateral];

            setFilteredCollaterals(newCollaterals);
        },
        [filteredCollaterals],
    );

    const handleCollateralsOnRemove = useCallback(
        (removedCollateral: LiquityV2Collateral) => {
            const newCollaterals = filteredCollaterals?.filter(
                (collateral) =>
                    collateral.token.address !==
                    removedCollateral.token.address,
            );

            setFilteredCollaterals(newCollaterals);
        },
        [filteredCollaterals],
    );

    const handleCollateralsOnApply = useCallback(() => {
        onCollateralsChange({ filters: filteredCollaterals });
        setOpen(false);
    }, [filteredCollaterals, onCollateralsChange]);

    function handleSwitchOnClick() {
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        if (open && !collaterals) setFilteredCollaterals(undefined);
        if (open) setFilteredCollaterals(collaterals);
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!filteredCollaterals && filteredCollaterals?.length > 0}
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
                            {filteredCollaterals?.map((collateral) => (
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
                        filters={filteredCollaterals}
                        supported={supportedCollaterals}
                        onAdd={handleCollateralsOnAdd}
                        onRemove={handleCollateralsOnRemove}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={
                            !unsavedChanges ||
                            !filteredCollaterals ||
                            ((!collaterals || collaterals.length === 0) &&
                                filteredCollaterals.length === 0)
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

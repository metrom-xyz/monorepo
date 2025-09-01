import { useCallback, useEffect, useState } from "react";
import { useChainId } from "@/src/hooks/useChainId";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useTranslations } from "next-intl";
import {
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
} from "@/src/types/campaign";
import { CollateralsList } from "./list";
import { Typography } from "@metrom-xyz/ui";
import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useLiquityV2Collaterals } from "@/src/hooks/useLiquityV2Collaterals";
import { CHAIN_TYPE } from "@/src/commons";

import styles from "./styles.module.css";

interface LiquityV2CollateralStepProps {
    disabled?: boolean;
    brand?: LiquityV2CampaignPayload["brand"];
    action?: LiquityV2CampaignPayload["action"];
    collateral?: LiquityV2CampaignPayload["collateral"];
    onCollateralChange: (value: LiquityV2CampaignPayloadPart) => void;
}

export function LiquityV2CollateralStep({
    disabled,
    brand,
    action,
    collateral,
    onCollateralChange,
}: LiquityV2CollateralStepProps) {
    const t = useTranslations("newCampaign.form.liquityV2.collaterals");

    const [open, setOpen] = useState(false);

    const chainId = useChainId();
    const { loading, collaterals } = useLiquityV2Collaterals({
        chainId,
        chainType: CHAIN_TYPE,
        brand: brand?.slug,
    });

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!collateral) return;
        setOpen(true);
    }, [collateral, disabled, action]);

    useEffect(() => {
        onCollateralChange({ collateral: undefined });
    }, [brand, action, onCollateralChange]);

    const handleCollateralChange = useCallback(
        (collateral: LiquityV2Collateral) => {
            onCollateralChange({ collateral });
            setOpen(false);
        },
        [onCollateralChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!collateral}
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
                    </div>
                }
            >
                {collateral && (
                    <div className={styles.previewWrapper}>
                        <div className={styles.collateralWrapper}>
                            <RemoteLogo
                                size="sm"
                                chain={chainId}
                                address={collateral.token.address}
                            />
                        </div>
                        <Typography weight="medium" size="sm">
                            {collateral?.token.symbol}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <CollateralsList
                    loading={loading}
                    action={action}
                    selected={collateral}
                    collaterals={collaterals}
                    onChange={handleCollateralChange}
                />
            </StepContent>
        </Step>
    );
}

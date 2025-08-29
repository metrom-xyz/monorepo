import { useCallback, useEffect, useState } from "react";
import { useChainId } from "@/src/hooks/use-chain-id";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useTranslations } from "next-intl";
import {
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign";
import { CollateralsList } from "./list";
import { Typography } from "@metrom-xyz/ui";
import type { AaveV3Collateral, LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { CHAIN_TYPE } from "@/src/commons";
import { useAaveV3Collaterals } from "@/src/hooks/useAaveV3Collaterals";

import styles from "./styles.module.css";

interface AaveV3CollateralStepProps {
    disabled?: boolean;
    brand?: AaveV3CampaignPayload["brand"];
    market?: AaveV3CampaignPayload["market"];
    action?: AaveV3CampaignPayload["action"];
    collateral?: AaveV3CampaignPayload["collateral"];
    onCollateralChange: (value: AaveV3CampaignPayloadPart) => void;
}

export function AaveV3CollateralStep({
    disabled,
    brand,
    market,
    action,
    collateral,
    onCollateralChange,
}: AaveV3CollateralStepProps) {
    const t = useTranslations("newCampaign.form.aaveV3.collaterals");

    const [open, setOpen] = useState(false);

    const chainId = useChainId();
    const { loading, collaterals } = useAaveV3Collaterals({
        chainId,
        chainType: CHAIN_TYPE,
        market: market?.address,
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
        (collateral: AaveV3Collateral) => {
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

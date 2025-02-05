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
import { Typography } from "@metrom-xyz/ui";
import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface LiquityV2CollateralStepProps {
    disabled?: boolean;
    action?: LiquityV2CampaignPayload["action"];
    collateral?: LiquityV2CampaignPayload["collateral"];
    supportedCollaterals?: LiquityV2CampaignPayload["supportedCollaterals"];
    onCollateralChange: (value: LiquityV2CampaignPayloadPart) => void;
}

export function LiquityV2CollateralStep({
    disabled,
    action,
    collateral,
    supportedCollaterals,
    onCollateralChange,
}: LiquityV2CollateralStepProps) {
    const t = useTranslations("newCampaign.form.liquityV2.collaterals");

    const [open, setOpen] = useState(true);

    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

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
            disabled={disabled || supportedCollaterals?.length === 0}
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
                        <Typography weight="medium" size="sm" uppercase>
                            {collateral?.token.symbol}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <CollateralsList
                    action={action}
                    selected={collateral}
                    supported={supportedCollaterals}
                    onChange={handleCollateralChange}
                />
            </StepContent>
        </Step>
    );
}

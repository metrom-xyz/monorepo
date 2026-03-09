import { useCallback, useEffect, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useTranslations } from "next-intl";
import { AssetsList } from "./list";
import { Typography } from "@metrom-xyz/ui";
import type { OdysseyAsset } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { OdysseyStrategyData } from "@/src/commons/odyssey";
import type { OdysseyCampaignPayloadPart } from "@/src/types/campaign";
import { useOdysseyAssets } from "@/src/hooks/useOdysseyAssets";
import type { OdysseyProtocol } from "@metrom-xyz/chains";

import styles from "./styles.module.css";

interface OdysseyStepProps {
    disabled?: boolean;
    brand?: OdysseyProtocol;
    strategy?: OdysseyStrategyData;
    asset?: OdysseyAsset;
    onAssetChange: (value: OdysseyCampaignPayloadPart) => void;
}

export function OdysseyAssetsStep({
    disabled,
    brand,
    strategy,
    asset,
    onAssetChange,
}: OdysseyStepProps) {
    const t = useTranslations("newCampaign.form.odyssey.assets");

    const [open, setOpen] = useState(false);

    const { id: chainId, type: chainType } = useChainWithType();
    const { loading, assets } = useOdysseyAssets({
        chainId,
        chainType,
        brand: brand?.slug,
        strategy: strategy?.id,
    });

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!assets) return;
        setOpen(true);
    }, [assets, disabled, strategy]);

    useEffect(() => {
        onAssetChange({ asset: undefined });
    }, [brand, strategy, onAssetChange]);

    const handleAssetChange = useCallback(
        (asset: OdysseyAsset) => {
            onAssetChange({ asset });
            setOpen(false);
        },
        [onAssetChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!asset}
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
                {asset && (
                    <div className={styles.previewWrapper}>
                        <div className={styles.collateralWrapper}>
                            <RemoteLogo
                                size="sm"
                                chain={chainId}
                                address={asset.address}
                            />
                        </div>
                        <Typography weight="medium" size="sm">
                            {asset.symbol}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <AssetsList
                    loading={loading}
                    strategy={strategy}
                    selected={asset}
                    assets={assets}
                    onChange={handleAssetChange}
                />
            </StepContent>
        </Step>
    );
}

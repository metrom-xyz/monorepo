import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import {
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign";
import { ProtocolType, type AaveV3Protocol } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { ProtocolLogo } from "@/src/components/protocol-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";

import styles from "./styles.module.css";

interface AaveV3StepProps {
    disabled?: boolean;
    brand?: AaveV3CampaignPayload["brand"];
    onBrandChange: (value: AaveV3CampaignPayloadPart) => void;
}

export function AaveV3BrandStep({
    disabled,
    brand,
    onBrandChange,
}: AaveV3StepProps) {
    const t = useTranslations("newCampaign.form.aaveV3.brand");
    const [open, setOpen] = useState(true);

    const { id: chainId, type: chainType } = useChainWithType();
    const supportedBrand = useProtocolsInChain({
        chainId,
        chainType,
        type: ProtocolType.AaveV3,
        active: true,
    });

    const selected = useMemo(() => {
        if (!brand) return undefined;
        return supportedBrand.find(({ slug }) => slug === brand.slug);
    }, [supportedBrand, brand]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!!brand || supportedBrand.length !== 1) return;
        onBrandChange({
            brand: supportedBrand[0],
        });
        setOpen(false);
    }, [supportedBrand, brand, onBrandChange]);

    const getPlatformChangeHandler = useCallback(
        (newPlatform: AaveV3Protocol) => {
            return () => {
                if (brand && brand.slug === newPlatform.slug) return;
                onBrandChange({
                    brand: newPlatform,
                });
                setOpen(false);
            };
        },
        [brand, onBrandChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled || supportedBrand.length === 0}
            open={open}
            completed={!!selected}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {!!selected && (
                    <div className={styles.preview}>
                        <ProtocolLogo protocol={selected} />
                        <Typography size="lg" weight="medium">
                            {selected.name}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.brandWrapper}>
                    {supportedBrand.map((availablePlatform) => (
                        <div
                            key={availablePlatform.slug}
                            onClick={getPlatformChangeHandler(
                                availablePlatform,
                            )}
                            className={classNames(styles.brandRow, {
                                [styles.brandRowSelected]:
                                    selected?.slug === availablePlatform.slug,
                            })}
                        >
                            <ProtocolLogo protocol={availablePlatform} />
                            <Typography size="lg" weight="medium">
                                {availablePlatform.name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}

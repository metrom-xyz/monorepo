import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import type {
    LiquityV2CampaignPayload,
    LiquityV2CampaignPayloadPart,
    LiquityV2BrandInfo,
} from "@/src/types";
import { useLiquityV2BrandsInChain } from "@/src/hooks/useLiquityV2PlatformsInChain";

import styles from "./styles.module.css";

interface LiquityV2BrandStepProps {
    disabled?: boolean;
    brand?: LiquityV2CampaignPayload["brand"];
    onBrandChange: (value: LiquityV2CampaignPayloadPart) => void;
}

export function LiquityV2BrandStep({
    disabled,
    brand,
    onBrandChange,
}: LiquityV2BrandStepProps) {
    const t = useTranslations("newCampaign.form.liquityV2.brand");
    const [open, setOpen] = useState(true);

    const chainId = useChainId();
    const availablePlatforms = useLiquityV2BrandsInChain(chainId);

    const selectedBrand = useMemo(() => {
        if (!brand) return undefined;
        return availablePlatforms.find((brand) => brand.slug === brand.slug);
    }, [availablePlatforms, brand]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!!brand || availablePlatforms.length !== 1) return;
        onBrandChange({
            brand: availablePlatforms[0],
        });
        setOpen(false);
    }, [availablePlatforms, brand, onBrandChange]);

    const getBrandChangeHandler = useCallback(
        (newPlatform: LiquityV2BrandInfo) => {
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
            disabled={disabled}
            open={open}
            completed={!!selectedBrand}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {!!selectedBrand && (
                    <div className={styles.preview}>
                        <div className={styles.logo}>
                            <selectedBrand.logo />
                        </div>
                        <Typography size="lg" weight="medium">
                            {selectedBrand.name}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.brandWrapper}>
                    {availablePlatforms.map((availablePlatform) => (
                        <div
                            key={availablePlatform.slug}
                            className={classNames(styles.brandRow, {
                                [styles.brandRowSelected]:
                                    selectedBrand?.slug ===
                                    availablePlatform.slug,
                            })}
                            onClick={getBrandChangeHandler(availablePlatform)}
                        >
                            <div className={styles.logo}>
                                <availablePlatform.logo />
                            </div>
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

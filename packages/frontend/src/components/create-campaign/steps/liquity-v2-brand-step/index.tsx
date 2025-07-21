import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import {
    type FormStepBaseProps,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
} from "@/src/types/campaign";
import {
    ProtocolType,
    type LiquityV2Protocol,
    type WithChain,
} from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";

import styles from "./styles.module.css";

interface LiquityV2BrandStepProps extends FormStepBaseProps {
    brand?: LiquityV2CampaignPayload["brand"];
    onBrandChange: (value: LiquityV2CampaignPayloadPart) => void;
}

export function LiquityV2BrandStep({
    loading,
    disabled,
    brand,
    onBrandChange,
}: LiquityV2BrandStepProps) {
    const t = useTranslations("newCampaign.form.liquityV2.brand");
    const [open, setOpen] = useState(false);

    const chainId = useChainId();
    const supportedBrands = useProtocolsInChain({
        chainId,
        type: ProtocolType.LiquityV2,
        active: true,
    });

    const selectedBrand = useMemo(() => {
        if (!brand) return undefined;
        return supportedBrands.find(({ slug }) => slug === brand.slug);
    }, [supportedBrands, brand]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!!brand || supportedBrands.length !== 1) return;
        onBrandChange({
            brand: supportedBrands[0],
        });
        setOpen(false);
    }, [supportedBrands, brand, onBrandChange]);

    const getBrandChangeHandler = useCallback(
        (newPlatform: WithChain<LiquityV2Protocol>) => {
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
            loading={loading}
            disabled={disabled || supportedBrands.length === 0}
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
                    {supportedBrands.map((availablePlatform) => (
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

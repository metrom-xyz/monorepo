import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { type OdysseyCampaignPayloadPart } from "@/src/types/campaign";
import { ProtocolType, type OdysseyProtocol } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { ProtocolLogo } from "@/src/components/protocol-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";

import styles from "./styles.module.css";

interface OdysseyBrandStepProps {
    disabled?: boolean;
    brand?: OdysseyProtocol;
    onBrandChange: (value: OdysseyCampaignPayloadPart) => void;
}

export function OdysseyBrandStep({
    disabled,
    brand,
    onBrandChange,
}: OdysseyBrandStepProps) {
    const t = useTranslations("newCampaign.form.odyssey.brand");
    const [open, setOpen] = useState(true);

    const { id: chainId, type: chainType } = useChainWithType();
    const supportedBrands = useProtocolsInChain({
        chainId,
        chainType,
        type: ProtocolType.Odyssey,
        active: true,
    });

    const selected = useMemo(() => {
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

    const getPlatformChangeHandler = useCallback(
        (newPlatform: OdysseyProtocol) => {
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
            disabled={disabled || supportedBrands.length === 0}
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
                    {supportedBrands.map((availablePlatform) => (
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

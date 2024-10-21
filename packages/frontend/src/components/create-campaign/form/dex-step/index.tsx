import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useDexesInChain } from "@/src/hooks/useDexesInChain";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import type {
    DexInfo,
    CampaignPayload,
    CampaignPayloadPart,
} from "@/src/types";

import styles from "./styles.module.css";

interface DexStepProps {
    disabled?: boolean;
    dex?: CampaignPayload["dex"];
    onDexChange: (dex: CampaignPayloadPart) => void;
}

export function DexStep({ disabled, dex, onDexChange }: DexStepProps) {
    const t = useTranslations("newCampaign.form.dex");
    const [open, setOpen] = useState(true);

    const chainId = useChainId();
    const availableDexes = useDexesInChain(chainId);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!!dex || availableDexes.length !== 1) return;
        onDexChange({ dex: availableDexes[0] });
        setOpen(false);
    }, [dex, availableDexes, onDexChange]);

    const getDexChangeHandler = useCallback(
        (newDex: DexInfo) => {
            return () => {
                if (dex && dex.slug === newDex.slug) return;
                onDexChange({ dex: newDex });
                setOpen(false);
            };
        },
        [dex, onDexChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!dex}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {dex && (
                    <div className={styles.dexPreview}>
                        <div className={styles.logo}>
                            <dex.logo />
                        </div>
                        <Typography variant="lg" weight="medium">
                            {dex.name}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.dexWrapper}>
                    {availableDexes.map((availableDex) => (
                        <div
                            key={availableDex.slug}
                            className={classNames(styles.dexRow, {
                                [styles.dexRowSelected]:
                                    dex?.slug === availableDex.slug,
                            })}
                            onClick={getDexChangeHandler(availableDex)}
                        >
                            <div className={styles.logo}>
                                <availableDex.logo />
                            </div>
                            <Typography variant="lg" weight="medium">
                                {availableDex.name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}

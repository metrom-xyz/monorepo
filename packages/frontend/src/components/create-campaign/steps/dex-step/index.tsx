import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useDexesInChain } from "@/src/hooks/useDexesInChain";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
    DexInfo,
} from "@/src/types";

import styles from "./styles.module.css";

interface DexStepProps {
    disabled?: boolean;
    dex?: AmmPoolLiquidityCampaignPayload["dex"];
    onDexChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
}

export function DexStep({ disabled, dex, onDexChange }: DexStepProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.dex");
    const [open, setOpen] = useState(true);

    const chainId = useChainId();
    const availableDexes = useDexesInChain(chainId);

    const selectedDex = useMemo(() => {
        if (!dex) return undefined;
        return availableDexes.find(
            (availableDex) => availableDex.slug === dex.slug,
        );
    }, [availableDexes, dex]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!!dex || availableDexes.length !== 1) return;
        onDexChange({
            dex: availableDexes[0],
        });
        setOpen(false);
    }, [availableDexes, dex, onDexChange]);

    const getDexChangeHandler = useCallback(
        (newDex: DexInfo) => {
            return () => {
                if (dex && dex.slug === newDex.slug) return;
                onDexChange({
                    dex: newDex,
                });
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
            disabled={disabled || availableDexes.length === 0}
            open={open}
            completed={!!selectedDex}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {!!selectedDex && (
                    <div className={styles.dexPreview}>
                        <div className={styles.logo}>
                            <selectedDex.logo />
                        </div>
                        <Typography size="lg" weight="medium">
                            {selectedDex.name}
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
                                    selectedDex?.slug === availableDex.slug,
                            })}
                            onClick={getDexChangeHandler(availableDex)}
                        >
                            <div className={styles.logo}>
                                <availableDex.logo />
                            </div>
                            <Typography size="lg" weight="medium">
                                {availableDex.name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}

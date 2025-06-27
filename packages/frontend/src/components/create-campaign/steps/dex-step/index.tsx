import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import {
    ProtocolType,
    type DexProtocol,
    type WithChain,
} from "@metrom-xyz/chains";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import {
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
    type FormStepBaseProps,
} from "@/src/types/campaign";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";

import styles from "./styles.module.css";

interface DexStepProps extends FormStepBaseProps {
    dex?: AmmPoolLiquidityCampaignPayload["dex"];
    onDexChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
}

export function DexStep({ loading, disabled, dex, onDexChange }: DexStepProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.dex");
    const [open, setOpen] = useState(false);

    const chainId = useChainId();
    const availableDexes = useProtocolsInChain({
        chainId,
        type: ProtocolType.Dex,
        active: true,
    });

    const selectedDex = useMemo(() => {
        if (!dex) return undefined;
        return availableDexes.find(({ slug }) => slug === dex.slug);
    }, [availableDexes, dex]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (loading || !!dex || availableDexes.length !== 1) return;
        onDexChange({
            dex: availableDexes[0],
        });
        setOpen(false);
    }, [loading, availableDexes, dex, onDexChange]);

    const getDexChangeHandler = useCallback(
        (newDex: WithChain<DexProtocol>) => {
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
            loading={loading}
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

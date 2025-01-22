import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useDexesInChain } from "@/src/hooks/useDexesInChain";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import type {
    CampaignPayload,
    DexInfo,
    TargetedCampaignPayloadPart,
} from "@/src/types";
import { TargetType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface ProtocolStepProps {
    title?: string;
    disabled?: boolean;
    protocol?: CampaignPayload["protocol"];
    onProtocolChange: (
        protocol: TargetedCampaignPayloadPart<TargetType.AmmPoolLiquidity>,
    ) => void;
}

export function ProtocolStep({
    title,
    disabled,
    protocol,
    onProtocolChange,
}: ProtocolStepProps) {
    const [open, setOpen] = useState(true);

    const chainId = useChainId();
    const availableDexes = useDexesInChain(chainId);

    const selectedDex = useMemo(() => {
        if (!protocol) return undefined;
        return availableDexes.find((dex) => dex.slug === protocol);
    }, [availableDexes, protocol]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (!!protocol || availableDexes.length !== 1) return;
        onProtocolChange({
            protocol: availableDexes[0].slug,
        });
        setOpen(false);
    }, [availableDexes, protocol, onProtocolChange]);

    const getDexChangeHandler = useCallback(
        (newDex: DexInfo) => {
            return () => {
                if (protocol && protocol === newDex.slug) return;
                onProtocolChange({
                    protocol: newDex.slug,
                });
                setOpen(false);
            };
        },
        [protocol, onProtocolChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!selectedDex}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={title}>
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

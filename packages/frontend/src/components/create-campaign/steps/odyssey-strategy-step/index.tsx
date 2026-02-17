import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { Typography } from "@metrom-xyz/ui";
import { type OdysseyCampaignPayloadPart } from "@/src/types/campaign";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useOdysseyStrategies } from "@/src/hooks/useOdysseyStrategies";
import {
    ODYSSEY_STRATEGIES,
    type OdysseyStrategyData,
} from "@/src/commons/odyssey";

import styles from "./styles.module.css";
import classNames from "classnames";

interface OdysseyStrategyStepProps {
    disabled?: boolean;
    strategy?: OdysseyStrategyData;
    onStrategyChange: (value: OdysseyCampaignPayloadPart) => void;
}

export function OdysseyStrategyStep({
    disabled,
    strategy,
    onStrategyChange,
}: OdysseyStrategyStepProps) {
    const t = useTranslations("newCampaign.form.odyssey.strategy");
    const [open, setOpen] = useState(true);

    const { id: chainId, type: chainType } = useChainWithType();
    const supportedStrategies = useOdysseyStrategies({
        chainId,
        chainType,
        crossVm: true,
        enabled: !!strategy,
    });

    const supportedStrategiesData: OdysseyStrategyData[] =
        supportedStrategies.map((supported) => ODYSSEY_STRATEGIES[supported]);

    const selected: OdysseyStrategyData | undefined = useMemo(() => {
        if (!strategy) return undefined;

        const selected = supportedStrategies.find(
            (supported) => supported === strategy.id,
        );
        if (!selected) return undefined;

        return { ...strategy, id: selected };
    }, [supportedStrategies, strategy]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    const getStrategyChangeHandler = useCallback(
        (newStrategy: OdysseyStrategyData) => {
            return () => {
                if (strategy && strategy.id === newStrategy.id) return;
                onStrategyChange({
                    strategy: newStrategy,
                });
                setOpen(false);
            };
        },
        [strategy, onStrategyChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled || supportedStrategies.length === 0}
            open={open}
            completed={!!selected}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {!!selected && (
                    <div className={styles.preview}>
                        <Typography size="lg" weight="medium">
                            {selected.name}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.strategies}>
                    {supportedStrategiesData.map((data) => (
                        <div
                            key={data.id}
                            onClick={getStrategyChangeHandler(data)}
                            className={classNames(styles.strategy, {
                                [styles.active]:
                                    selected && selected.id === data.id,
                            })}
                        >
                            <Typography size="lg" weight="medium">
                                {data.name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}

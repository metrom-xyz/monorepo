import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useTranslations } from "next-intl";
import {
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { AaveV3Action } from "@/src/types/common";

import styles from "./styles.module.css";

// TODO: add proper icons
export const AAVE_V3_ACTIONS = [
    {
        title: "list.borrow",
        logo: null,
        value: AaveV3Action.Borrow,
    },
    {
        title: "list.supply",
        logo: null,
        value: AaveV3Action.Supply,
    },
    {
        title: "list.netSupply",
        logo: null,
        value: AaveV3Action.NetSupply,
    },
] as const;

interface AaveV3ActionStepProps {
    disabled?: boolean;
    action?: AaveV3CampaignPayload["action"];
    onActionChange: (value: AaveV3CampaignPayloadPart) => void;
}

export function AaveV3ActionStep({
    disabled,
    action,
    onActionChange,
}: AaveV3ActionStepProps) {
    const t = useTranslations("newCampaign.form.aaveV3.action");

    const [open, setOpen] = useState(false);

    const { id: chainId } = useChainWithType();

    const selected = useMemo(() => {
        if (!action) return undefined;
        return AAVE_V3_ACTIONS.find(({ value }) => value === action);
    }, [action]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!action) return;
        setOpen(true);
    }, [disabled, action]);

    const getActionChangeHandler = useCallback(
        (newAction: AaveV3Action) => {
            return () => {
                if (action && action === newAction) return;
                onActionChange({
                    action: newAction,
                });
                setOpen(false);
            };
        },
        [action, onActionChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!action}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {!!selected && (
                    <div className={styles.preview}>
                        <Typography size="lg" weight="medium">
                            {t(selected.title)}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.actionsWrapper}>
                    {AAVE_V3_ACTIONS.map(({ title, value }) => (
                        <div
                            key={value}
                            onClick={getActionChangeHandler(value)}
                            className={classNames(styles.action, {
                                [styles.active]: selected?.value === value,
                            })}
                        >
                            <div className={styles.textWrapper}>
                                <Typography weight="medium" size="lg" uppercase>
                                    {t(title)}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}

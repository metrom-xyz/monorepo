import { act, useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useTranslations } from "next-intl";
import {
    LiquityV2Action,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
} from "@/src/types";
import { LiquityDepositActionIcon } from "@/src/assets/liquity-deposit-action-icon";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export const LIQUITY_V2_SUPPORTED_ACTIONS = [
    {
        title: "list.debt.title",
        description: "list.debt.description",
        logo: <LiquityDepositActionIcon />,
        value: LiquityV2Action.Debt,
    },
] as const;

interface LiquityV2ActionStepProps {
    disabled?: boolean;
    action?: LiquityV2CampaignPayload["action"];
    onActionChange: (value: LiquityV2CampaignPayloadPart) => void;
}

export function LiquityV2ActionStep({
    disabled,
    action,
    onActionChange,
}: LiquityV2ActionStepProps) {
    const t = useTranslations("newCampaign.form.liquityV2.action");

    const [open, setOpen] = useState(true);

    const chainId = useChainId();

    const selectedAction = useMemo(() => {
        if (!action) return undefined;
        return LIQUITY_V2_SUPPORTED_ACTIONS.find(
            (supportedAction) => supportedAction.value === action,
        );
    }, [action]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    const getActionChangeHandler = useCallback(
        (newAction: LiquityV2Action) => {
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
                {!!selectedAction && (
                    <div className={styles.preview}>
                        <div className={styles.logo}>{selectedAction.logo}</div>
                        <Typography size="lg" weight="medium">
                            {t(selectedAction.title)}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.actionsWrapper}>
                    {LIQUITY_V2_SUPPORTED_ACTIONS.map(
                        ({ title, description, logo, value }) => (
                            <div
                                key={value}
                                className={styles.action}
                                onClick={getActionChangeHandler(value)}
                            >
                                <div className={styles.actionIconWrapper}>
                                    {logo}
                                </div>
                                <div className={styles.textWrapper}>
                                    <Typography
                                        weight="medium"
                                        size="lg"
                                        uppercase
                                    >
                                        {t(title)}
                                    </Typography>
                                    <Typography weight="medium" light>
                                        {t(description)}
                                    </Typography>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </StepContent>
        </Step>
    );
}

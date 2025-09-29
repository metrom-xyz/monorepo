import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactSVGElement,
} from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useTranslations } from "next-intl";
import {
    CampaignKind,
    type BaseCampaignPayloadPart,
} from "@/src/types/campaign";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";

import styles from "./styles.module.css";

export interface CampaignKindOption<T extends string> {
    label: T;
    value: CampaignKind;
    icon?: ReactSVGElement;
}

export interface CampaignKindStepProps {
    disabled?: boolean;
    kinds: CampaignKindOption<string>[];
    kind?: CampaignKind;
    onKindChange: (value: BaseCampaignPayloadPart) => void;
}

export function CampaignKindStep({
    disabled,
    kinds,
    kind,
    onKindChange,
}: CampaignKindStepProps) {
    const t = useTranslations("newCampaign.form.base.kind");

    const [open, setOpen] = useState(false);

    const { id: chainId } = useChainWithType();

    const selected = useMemo(() => {
        if (!kind) return undefined;
        return kinds.find(({ value }) => value === kind);
    }, [kinds, kind]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!kind) return;
        setOpen(true);
    }, [disabled, kind]);

    const getKindChangeHandler = useCallback(
        (newKind: CampaignKind) => {
            return () => {
                if (kind && kind === newKind) return;
                onKindChange({
                    kind: newKind,
                });
                setOpen(false);
            };
        },
        [kind, onKindChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!kind}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {!!selected && (
                    <div className={styles.preview}>
                        <Typography size="lg" weight="medium">
                            {selected.label}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.wrapper}>
                    {kinds.map(({ label, value }) => (
                        <div
                            key={value}
                            onClick={getKindChangeHandler(value)}
                            className={classNames(styles.kind, {
                                [styles.active]: selected?.value === value,
                            })}
                        >
                            <div className={styles.text}>
                                <Typography weight="medium" size="lg" uppercase>
                                    {label}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}

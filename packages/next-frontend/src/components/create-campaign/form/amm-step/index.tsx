import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useAvailableAmms } from "@/src/hooks/useAvailableAmms";
import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";

import styles from "./styles.module.css";

interface AmmStepProps {
    amm?: CampaignPayload["amm"];
    onAmmChange: (amm: CampaignPayloadPart) => void;
}

export function AmmStep({ amm, onAmmChange }: AmmStepProps) {
    const t = useTranslations("new_campaign.form.dex");
    const availableAmms = useAvailableAmms();

    const selected = useMemo(() => {
        if (!amm) return null;
        return availableAmms.find((available) => available.slug === amm);
    }, [availableAmms, amm]);

    const getDexChangeHandler = useCallback(
        (amm: CampaignPayload["amm"]) => {
            return () => {
                if (selected && selected.slug === amm) return;
                onAmmChange({ amm });
            };
        },
        [selected, onAmmChange],
    );

    return (
        <Step closeBehavior="innerClick">
            <StepPreview completed={!!selected} label={t("title")}>
                {selected && (
                    <div className={styles.dex__preview}>
                        <div className={styles.logo}>
                            <selected.logo />
                        </div>
                        <Typography variant="lg" weight="medium">
                            {selected.name}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.dex__wrapper}>
                    {availableAmms.map(({ slug, name, logo: Logo }) => (
                        <div
                            key={slug}
                            className={classNames(styles.dex__row, {
                                [styles.dex__row_selected]:
                                    selected?.slug === slug,
                            })}
                            onClick={getDexChangeHandler(slug)}
                        >
                            <div className={styles.logo}>
                                <Logo />
                            </div>
                            <Typography variant="lg" weight="medium">
                                {name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}

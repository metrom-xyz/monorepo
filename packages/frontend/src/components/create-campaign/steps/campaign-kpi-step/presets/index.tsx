import { useTranslations } from "next-intl";
import { KPI_PRESETS } from "..";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { useCallback } from "react";

import styles from "./styles.module.css";

interface KpiPresetsProps {
    targetValueName: string;
    value?: KpiPresetType;
    onChange: (value: KpiPresetType) => void;
}

export enum KpiPresetType {
    TraditionalReward = "traditional-reward",
    CappedRewardRate = "capped-reward-rate",
    IncreasingApr = "increasing-apr",
    CustomRewardRate = "custom-reward-rate",
}

export function KpiPresets({
    targetValueName,
    value,
    onChange,
}: KpiPresetsProps) {
    const t = useTranslations("newCampaign.form.kpi.presets");

    const handleOnClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();

            const type = (event.currentTarget as HTMLDivElement).dataset.type;
            if (!type) return;

            onChange(type as KpiPresetType);
        },
        [onChange],
    );

    return (
        <div className={styles.root}>
            {Object.entries(KPI_PRESETS).map(([type, preset]) => (
                <div
                    key={type}
                    data-type={type}
                    onClick={handleOnClick}
                    className={classNames(styles.preset, {
                        [styles.active]: value === type,
                    })}
                >
                    <preset.icon className={styles.icon} />
                    <div className={styles.content}>
                        <Typography size="sm" weight="medium">
                            {t(preset.title)}
                        </Typography>
                        <Typography size="xs" variant="tertiary">
                            {t(preset.description, { targetValueName })}
                        </Typography>
                    </div>
                </div>
            ))}
        </div>
    );
}

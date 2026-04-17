import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { FormStepPreview } from "../../form-step-preview";
import { useFormSteps } from "@/src/context/form-steps";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import type { CampaignPayloadKpiDistribution } from "@/src/types/campaign/common";

import styles from "./styles.module.css";

interface KpiProps {
    kpiDistribution?: CampaignPayloadKpiDistribution;
}

export function Kpi({ kpiDistribution }: KpiProps) {
    const t = useTranslations("newCampaign.formPreview");
    const { errors } = useFormSteps();

    if (!kpiDistribution) return null;

    const { goal, minimumPayoutPercentage } = kpiDistribution;

    return (
        <FormStepPreview
            title={
                <Typography size="xs" weight="semibold" uppercase>
                    {t("kpiSetup")}
                </Typography>
            }
            completed
            error={!!errors.kpi}
        >
            <div className={styles.parameters}>
                <Typography size="xs" weight="medium" variant="tertiary">
                    {t("parameters")}
                </Typography>
                <div className={styles.row}>
                    <Typography size="sm" weight="medium" uppercase>
                        {`${formatUsdAmount({ amount: goal?.lowerUsdTarget })} - ${formatUsdAmount({ amount: goal?.upperUsdTarget })}`}
                    </Typography>
                    <Typography
                        size="sm"
                        weight="medium"
                        uppercase
                        variant="tertiary"
                    >
                        {t("bounds")}
                    </Typography>
                </div>
                <div className={styles.row}>
                    <Typography size="sm" weight="medium" uppercase>
                        {formatPercentage({
                            percentage: minimumPayoutPercentage,
                        })}
                    </Typography>
                    <Typography
                        size="sm"
                        weight="medium"
                        uppercase
                        variant="tertiary"
                    >
                        {t("minPayout")}
                    </Typography>
                </div>
            </div>
        </FormStepPreview>
    );
}

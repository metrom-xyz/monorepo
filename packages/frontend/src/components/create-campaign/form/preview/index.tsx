import { useTranslations } from "next-intl";
import { Button, Typography } from "@metrom-xyz/ui";
import { ShareIcon } from "@/src/assets/share-icon";
import { PlusCircleIcon } from "@/src/assets/plus-circle-icon";
import type { CampaignPayload } from "@/src/types/campaign/common";
import { isAmmPoolLiquidityCampaignPayload } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { isAaveV3CampaignPayload } from "@/src/types/campaign/aave-v3-campaign";
import { AmmLiquidityPoolFormPreview } from "./amm-liquidity-pool-form-preview";
import { AaveV3FormPreview } from "./aave-v3-form-preview";
import { DocumentTextIcon } from "@/src/assets/document-text-icon";
import { useFormSteps } from "@/src/context/form-steps";
import { Kpi } from "../../previews/kpi";

import styles from "./styles.module.css";

interface FormPreviewProps {
    payload: CampaignPayload | null;
}

export function FormPreview({ payload }: FormPreviewProps) {
    const t = useTranslations("newCampaign.formPreview");
    const { errors } = useFormSteps();

    const ammPoolLiquidityCampaignPayload =
        payload && isAmmPoolLiquidityCampaignPayload(payload);
    const aaveV3CampaignPayload = payload && isAaveV3CampaignPayload(payload);

    const emptyPayload = !payload?.chainId;
    const kpiSetup = payload?.kpiDistribution;

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography size="lg" weight="medium" className={styles.title}>
                    {t("preview")}
                </Typography>
                <div className={styles.buttons}>
                    <Button
                        size="sm"
                        disabled
                        icon={ShareIcon}
                        className={{ root: styles.button }}
                    >
                        {t("share")}
                    </Button>
                    <Button
                        size="sm"
                        disabled
                        icon={PlusCircleIcon}
                        className={{ root: styles.button }}
                    >
                        {t("saveAsPreset")}
                    </Button>
                </div>
            </div>
            {emptyPayload ? (
                <div className={styles.empty}>
                    <DocumentTextIcon className={styles.documentTextIcon} />
                    <div className={styles.emptyText}>
                        <Typography
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("campaignPreview")}
                        </Typography>
                        <Typography size="sm" variant="tertiary">
                            {t("emptyText")}
                        </Typography>
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    {ammPoolLiquidityCampaignPayload && (
                        <AmmLiquidityPoolFormPreview
                            payload={payload}
                            errors={errors}
                        />
                    )}
                    {aaveV3CampaignPayload && (
                        <AaveV3FormPreview payload={payload} errors={errors} />
                    )}
                    {kpiSetup && (
                        <Kpi kpiDistribution={payload.kpiDistribution} />
                    )}
                </div>
            )}
        </div>
    );
}

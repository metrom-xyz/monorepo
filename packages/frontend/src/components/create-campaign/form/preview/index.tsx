import { useTranslations } from "next-intl";
import { Button, Typography } from "@metrom-xyz/ui";
import { ShareIcon } from "@/src/assets/share-icon";
import { PlusCircleIcon } from "@/src/assets/plus-circle-icon";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
} from "@/src/types/campaign/common";
import { isAmmPoolLiquidityCampaignPayload } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { isAaveV3CampaignPayload } from "@/src/types/campaign/aave-v3-campaign";
import { AmmLiquidityPoolFormPreview } from "./amm-liquidity-pool-form-preview";
import { AaveV3FormPreview } from "./aave-v3-form-preview";

import styles from "./styles.module.css";

interface FormPreviewProps {
    payload: CampaignPayload | null;
    errors: CampaignPayloadErrors;
}

export function FormPreview({ payload, errors }: FormPreviewProps) {
    const t = useTranslations("newCampaign.formPreview");

    const ammPoolLiquidityCampaignPayload =
        payload && isAmmPoolLiquidityCampaignPayload(payload);
    const aaveV3CampaignPayload = payload && isAaveV3CampaignPayload(payload);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography size="lg" weight="medium" className={styles.title}>
                    {t("preview")}
                </Typography>
                <div className={styles.buttons}>
                    <Button size="sm" disabled icon={ShareIcon}>
                        {t("share")}
                    </Button>
                    <Button size="sm" disabled icon={PlusCircleIcon}>
                        {t("saveAsPreset")}
                    </Button>
                </div>
            </div>
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
            </div>
        </div>
    );
}

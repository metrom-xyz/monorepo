import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { RemoteLogo } from "@/src/components/remote-logo";
import { getLiquityV2CampaignPreviewName } from "@/src/utils/campaign";
import type { LiquityV2CampaignPayload } from "@/src/types/campaign/liquity-v2-campaign";
import { useChainData } from "@/src/hooks/useChainData";

import styles from "./styles.module.css";

interface LiquityV2TargetProps {
    payload: LiquityV2CampaignPayload | null;
}

export function LiquityV2Target({ payload }: LiquityV2TargetProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");
    const chainData = useChainData({
        chainId: payload?.collateral?.chainId,
        chainType: payload?.collateral?.chainType,
    });

    if (
        !payload ||
        !payload.brand ||
        !payload.collateral ||
        !payload.kind ||
        !chainData
    )
        return null;

    const ChainLogo = chainData.icon;

    return (
        <div className={styles.root}>
            <Typography size="xs" weight="medium" variant="tertiary">
                {t("target")}
            </Typography>
            <div className={styles.collateralIdentity}>
                <ChainLogo className={styles.chainIcon} />
                <RemoteLogo
                    size="xxs"
                    chain={payload.collateral.chainId}
                    address={payload.collateral.address}
                />
                <Typography size="sm" weight="medium" noWrap truncate>
                    {getLiquityV2CampaignPreviewName(
                        globalT,
                        payload.kind,
                        payload.brand,
                        payload.collateral,
                    )}
                </Typography>
            </div>
        </div>
    );
}

import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { RemoteLogo } from "@/src/components/remote-logo";
import { getAaveV3CampaignPreviewName } from "@/src/utils/campaign";
import type { AaveV3CampaignPayload } from "@/src/types/campaign/aave-v3-campaign";
import { useChainData } from "@/src/hooks/useChainData";

import styles from "./styles.module.css";

interface AaveV3TargetProps {
    payload: AaveV3CampaignPayload | null;
}

export function AaveV3Target({ payload }: AaveV3TargetProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");
    const chainData = useChainData({
        chainId: payload?.collateral?.chainId,
        chainType: payload?.collateral?.chainType,
    });

    if (
        !payload ||
        !payload.brand ||
        !payload.chainId ||
        !payload.market ||
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
                    {getAaveV3CampaignPreviewName(
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

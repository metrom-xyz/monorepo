import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { RemoteLogo } from "@/src/components/remote-logo";
import {
    geAaveV3CampaignPreviewName,
    getCampaignTargetValueName,
} from "@/src/utils/campaign";
import type { AaveV3CampaignPayload } from "@/src/types/campaign/aave-v3-campaign";
import { formatUsdAmount } from "@/src/utils/format";
import { useChainData } from "@/src/hooks/useChainData";
import { getAaveV3UsdTarget } from "@/src/utils/aave-v3";

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
                    {geAaveV3CampaignPreviewName(
                        globalT,
                        payload.kind,
                        payload.brand,
                        payload.collateral,
                    )}
                </Typography>
            </div>
            <Typography size="xs" weight="medium" variant="tertiary" uppercase>
                {getCampaignTargetValueName(globalT, payload.kind)}:{" "}
                {formatUsdAmount({
                    amount: getAaveV3UsdTarget({
                        collateral: payload.collateral,
                        kind: payload.kind,
                    }),
                })}
            </Typography>
        </div>
    );
}

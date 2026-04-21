import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { RemoteLogo } from "@/src/components/remote-logo";
import { getHoldFungibleAssetCampaignPreviewName } from "@/src/utils/campaign";
import { useChainData } from "@/src/hooks/useChainData";
import type { HoldFungibleAssetCampaignPayload } from "@/src/types/campaign/hold-fungible-asset-campaign";
import { useChainType } from "@/src/hooks/useChainType";

import styles from "./styles.module.css";

interface HoldFungibleTargetProps {
    payload: HoldFungibleAssetCampaignPayload | null;
}

export function HoldFungibleAssetTarget({ payload }: HoldFungibleTargetProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");
    const chainType = useChainType();
    const chainData = useChainData({
        chainId: payload?.chainId,
        chainType,
    });

    if (
        !payload ||
        !payload.chainId ||
        !payload.asset ||
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
            <div className={styles.asset}>
                <ChainLogo className={styles.chainIcon} />
                <RemoteLogo
                    size="xxs"
                    chain={payload.chainId}
                    address={payload.asset.address}
                />
                <Typography size="sm" weight="medium" noWrap truncate>
                    {getHoldFungibleAssetCampaignPreviewName(
                        globalT,
                        payload.asset,
                    )}
                </Typography>
            </div>
        </div>
    );
}

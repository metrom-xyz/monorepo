import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { RemoteLogo } from "@/src/components/remote-logo";
import { getErc4626VaultCampaignPreviewName } from "@/src/utils/campaign";
import { useChainData } from "@/src/hooks/useChainData";
import { useChainType } from "@/src/hooks/useChainType";
import type { Erc4626VaultCampaignPayload } from "@/src/types/campaign/erc4626-vault-campaign";

import styles from "./styles.module.css";

interface Erc4626VaultTargetProps {
    payload: Erc4626VaultCampaignPayload | null;
}

export function Erc4626VaultTarget({ payload }: Erc4626VaultTargetProps) {
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
        !payload.brand ||
        !payload.vault ||
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
            <div className={styles.vault}>
                <ChainLogo className={styles.chainIcon} />
                <RemoteLogo
                    size="xxs"
                    chain={payload.chainId}
                    address={payload.vault.address}
                />
                <Typography size="sm" weight="medium">
                    {getErc4626VaultCampaignPreviewName(
                        globalT,
                        payload.brand.name,
                        payload.vault,
                    )}
                </Typography>
            </div>
        </div>
    );
}

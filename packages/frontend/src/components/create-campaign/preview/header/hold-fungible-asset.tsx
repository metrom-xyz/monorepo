import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import type { HoldFungibleAssetCampaignPreviewPayload } from "@/src/types/campaign";
import { getCampaignPreviewName } from "@/src/utils/campaign";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

interface HoldFungibleAssetProps {
    payload: HoldFungibleAssetCampaignPreviewPayload;
}

export function HoldFungibleAsset({ payload }: HoldFungibleAssetProps) {
    const t = useTranslations();
    const { id: chainId } = useChainWithType();

    return (
        <>
            <div className={styles.fungibleAssetWrapper}>
                <RemoteLogo
                    size="lg"
                    chain={chainId}
                    address={payload.asset.address}
                    defaultText={payload.asset.symbol}
                />
                <PoolRemoteLogo
                    chain={chainId}
                    tokens={payload.stakingAssets.map((asset) => ({
                        address: asset.address,
                        defaultText: asset.symbol,
                    }))}
                    className={{ root: styles.fungibleStakingAssets }}
                />
            </div>
            <Typography weight="medium" size="xl">
                {getCampaignPreviewName(t, payload)}
            </Typography>
        </>
    );
}

import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { RestrictionType, TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface HoldFungibleAssetProps<T extends TargetType.HoldFungibleAsset> {
    campaign: TargetedNamedCampaign<T>;
}

export function HoldFungibleAsset<T extends TargetType.HoldFungibleAsset>({
    campaign,
}: HoldFungibleAssetProps<T>) {
    const t = useTranslations("allCampaigns");

    return (
        <div className={styles.root}>
            <RemoteLogo
                address={campaign.target.asset.address}
                chain={campaign.target.chainId}
            />
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" truncate>
                    {campaign.name}
                </Typography>
                {campaign.specification?.kpi && (
                    <div className={styles.chip}>
                        <Typography size="sm" weight="medium" uppercase>
                            {t("kpi")}
                        </Typography>
                    </div>
                )}
                {campaign.restrictions?.type === RestrictionType.Whitelist && (
                    <div className={styles.chip}>
                        <Typography size="xs" weight="medium" uppercase>
                            {t("restricted")}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}

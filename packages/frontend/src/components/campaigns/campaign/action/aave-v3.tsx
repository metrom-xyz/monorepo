import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { RestrictionType, type AaveV3TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface AaveV3Props<T extends AaveV3TargetType> {
    campaign: TargetedNamedCampaign<T>;
}

export function AaveV3<T extends AaveV3TargetType>({
    campaign,
}: AaveV3Props<T>) {
    const t = useTranslations("allCampaigns");

    return (
        <div className={styles.root}>
            <RemoteLogo
                address={campaign.target.collateral.token.address}
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

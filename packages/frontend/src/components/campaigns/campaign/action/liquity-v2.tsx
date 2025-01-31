import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { TargetType, type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { ProtocolType, type TargetedNamedCampaign } from "@/src/types";
import { LiquityV2FilteredCollaterals } from "@/src/components/liquity-v2-filtered-collaterals";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface LiquityV2Props<T extends LiquityV2TargetType> {
    campaign: TargetedNamedCampaign<T>;
}

export function LiquidityV2<T extends LiquityV2TargetType>({
    campaign,
}: LiquityV2Props<T>) {
    const t = useTranslations("allCampaigns");
    const protocols = useProtocolsInChain(
        campaign.chainId,
        ProtocolType.LiquityV2,
    );

    const protocol =
        campaign.isTargeting(TargetType.LiquityV2Debt) &&
        protocols.find(({ slug }) => slug === campaign.target.brand.slug);

    return (
        <div className={styles.root}>
            <LiquityV2FilteredCollaterals campaign={campaign} />
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" truncate>
                    {campaign.name}
                </Typography>
                {protocol && (
                    <RemoteLogo
                        size="sm"
                        chain={campaign.chainId}
                        address={protocol.debtToken.address}
                    />
                )}
                {campaign.specification?.kpi && (
                    <div className={styles.chip}>
                        <Typography size="sm" weight="medium" uppercase>
                            {t("kpi")}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}

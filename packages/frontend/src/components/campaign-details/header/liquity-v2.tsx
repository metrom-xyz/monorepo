import { useCallback } from "react";
import { Typography, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { AprChip } from "../../apr-chip";
import { DistributablesType, type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { ProtocolType, type TargetedNamedCampaign } from "@/src/types";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { LiquityV2FilteredCollaterals } from "../../liquity-v2-filtered-collaterals";

import styles from "./styles.module.css";

interface LiquityV2HeaderProps {
    campaign: TargetedNamedCampaign<LiquityV2TargetType>;
}

export function LiquityV2Header({ campaign }: LiquityV2HeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    const brand = useProtocolsInChain(
        campaign.chainId,
        ProtocolType.LiquityV2,
    ).find((brand) => brand.slug === campaign.target.brand.slug);

    const actionLink = brand?.actionUrls[campaign.target.type];

    const handleClaimOnClick = useCallback(() => {
        router.push("/claims");
    }, [router]);

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    {brand && <brand.logo className={styles.logo} />}
                    <Typography size="xl4" weight="medium">
                        {campaign.name}
                    </Typography>
                    <LiquityV2FilteredCollaterals
                        size="xl"
                        campaign={campaign}
                    />
                </div>
                <Typography size="sm" weight="medium" light>
                    {t("rewardsMayVary")}
                </Typography>
            </div>
            <div className={styles.actionsContainer}>
                <div className={styles.leftActions}>
                    {campaign.isDistributing(DistributablesType.Tokens) && (
                        <Button size="sm" onClick={handleClaimOnClick}>
                            {t("claim")}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        href={actionLink}
                        disabled={!actionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t(`liquityV2.${campaign.target.type}`)}
                    </Button>
                </div>
                {campaign.apr &&
                    campaign.isDistributing(DistributablesType.Tokens) && (
                        <AprChip
                            prefix
                            size="lg"
                            apr={campaign.apr}
                            kpi={!!campaign.specification?.kpi}
                        />
                    )}
            </div>
        </div>
    );
}

import { useCallback } from "react";
import { Typography, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { AprChip } from "../../apr-chip";
import { DistributablesType, type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { ChainChip } from "../../chain-chip";
import { ProtocolChip } from "../../protocol-chip";

import styles from "./styles.module.css";

interface LiquityV2HeaderProps {
    campaign: TargetedNamedCampaign<LiquityV2TargetType>;
}

export function LiquityV2Header({ campaign }: LiquityV2HeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    const brand = useProtocolsInChain({
        chainId: campaign.chainId,
        type: ProtocolType.LiquityV2,
    }).find((brand) => brand.slug === campaign.target.brand.slug);

    const ChainIcon = campaign.chainData?.icon;
    const actionLink = brand?.actionUrls[campaign.target.type];

    const handleClaimOnClick = useCallback(() => {
        router.push("/claims");
    }, [router]);

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <Typography size="xl4" weight="medium">
                        {campaign.name}
                    </Typography>
                </div>
                <div className={styles.chips}>
                    <ChainChip id={campaign.chainId} surface />
                    <ProtocolChip campaign={campaign} surface />
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
                        {t(`liquityV2.${campaign.target.type}`, {
                            collateral: campaign.target.collateral.symbol,
                            debtToken: brand?.debtToken.symbol || "",
                        })}
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

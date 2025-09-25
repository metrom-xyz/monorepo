import { useCallback } from "react";
import { Typography, Button, InfoTooltip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { AprChip } from "../../apr-chip";
import { DistributablesType, type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { RemoteLogo } from "../../remote-logo";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

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
                    {ChainIcon && (
                        <InfoTooltip
                            placement="top"
                            icon={<ChainIcon className={styles.chainLogo} />}
                        >
                            <Typography size="sm">
                                {campaign.chainData.name}
                            </Typography>
                        </InfoTooltip>
                    )}
                    <RemoteLogo
                        size="xl"
                        address={campaign.target.collateral.token.address}
                        chain={campaign.target.chainId}
                    />
                    <Typography size="xl4" weight="medium">
                        {campaign.name}
                    </Typography>
                </div>
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
                        href={actionLink || undefined}
                        disabled={!actionLink}
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={{
                            icon: styles.externalLinkIcon,
                        }}
                    >
                        {t(`liquityV2.${campaign.target.type}`, {
                            collateral: campaign.target.collateral.token.symbol,
                            debtToken: brand?.debtToken.symbol || "",
                        })}
                    </Button>
                </div>
                {campaign.isDistributing(DistributablesType.Tokens) && (
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

import { Typography, Button, InfoTooltip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { RemoteLogo } from "../../remote-logo";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { Tags } from "./tags";

import styles from "./styles.module.css";

interface LiquityV2HeaderProps {
    campaign: TargetedNamedCampaign<LiquityV2TargetType>;
}

export function LiquityV2Header({ campaign }: LiquityV2HeaderProps) {
    const t = useTranslations("campaignDetails.header");

    const brand = useProtocolsInChain({
        chainId: campaign.chainId,
        type: ProtocolType.LiquityV2,
    }).find((brand) => brand.slug === campaign.target.brand.slug);

    const ChainIcon = campaign.chainData?.icon;
    const actionLink = brand?.actionUrls[campaign.target.type];

    return (
        <>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    {ChainIcon && (
                        <InfoTooltip
                            icon={<ChainIcon className={styles.chainLogo} />}
                        >
                            <Typography size="sm">
                                {campaign.chainData.name}
                            </Typography>
                        </InfoTooltip>
                    )}
                    <RemoteLogo
                        size="lg"
                        address={campaign.target.collateral.address}
                        chain={campaign.target.chainId}
                    />
                    <Typography size="xl3" weight="medium">
                        {campaign.name}
                    </Typography>
                </div>
                <Tags campaign={campaign} />
            </div>
            <div className={styles.actions}>
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
                        collateral: campaign.target.collateral.symbol,
                        debtToken: brand?.debtToken.symbol || "",
                    })}
                </Button>
            </div>
        </>
    );
}

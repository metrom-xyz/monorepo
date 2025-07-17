"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";
import { AmmCampaignIcon } from "@/src/assets/amm-campaign-icon";
import classNames from "classnames";
import { CampaignType } from "@/src/types/campaign";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { Redirect } from "./redirect";
import { useChainId } from "@/src/hooks/use-chain-id";

import styles from "./styles.module.css";

const CAMPAIGN_TYPES = [
    {
        path: `/campaigns/create/${CampaignType.AmmPoolLiquidity}`,
        title: "amm.title",
        description: "amm.description",
        className: styles.ammFormIcon,
        type: ProtocolType.Dex,
        icon: <AmmCampaignIcon className={styles.ammIcon} />,
    },
    {
        path: `/campaigns/create/${CampaignType.LiquityV2}`,
        title: "liquityV2.title",
        description: "liquityV2.description",
        className: styles.liquityV2FormIcon,
        type: ProtocolType.LiquityV2,
        icon: <LiquityV2CampaignIcon className={styles.liquidityV2Icon} />,
    },
];

export function CreateCampaign() {
    const t = useTranslations("newCampaign.pickType");

    const chainId = useChainId();
    const dexProtocols = useProtocolsInChain({
        chainId,
        type: ProtocolType.Dex,
        active: true,
    });
    const liquityV2Protocols = useProtocolsInChain({
        chainId,
        type: ProtocolType.LiquityV2,
        active: true,
    });

    const protocols = {
        [ProtocolType.Dex]: dexProtocols,
        [ProtocolType.LiquityV2]: liquityV2Protocols,
    };

    if (dexProtocols.length === 0 && liquityV2Protocols.length === 0)
        return (
            <div className={styles.emptyWrapper}>
                <Typography weight="medium" size="lg">
                    {t("empty.message1")}
                </Typography>
                <Typography weight="medium" size="lg">
                    {t("empty.message2")}
                </Typography>
            </div>
        );

    if (dexProtocols.length === 0 || liquityV2Protocols.length === 0)
        return <Redirect {...protocols} />;

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg" uppercase>
                {t("title")}
            </Typography>
            <Typography weight="medium" light className={styles.description}>
                {t("description")}
            </Typography>
            <div className={styles.campaignCardsWrapper}>
                {CAMPAIGN_TYPES.map(
                    ({ path, title, description, type, icon, className }) => {
                        const disabled = protocols[type].length === 0;

                        if (disabled) return null;

                        return (
                            <Link key={path} href={path}>
                                <Card className={styles.campaignCard}>
                                    <div className={styles.campaignCardBody}>
                                        <div
                                            className={classNames(
                                                styles.iconWrapper,
                                                className,
                                            )}
                                        >
                                            {icon}
                                        </div>
                                        <div className={styles.rightContent}>
                                            <Typography
                                                weight="medium"
                                                size="lg"
                                            >
                                                {t<any>(title)}
                                            </Typography>
                                            <Typography weight="medium" light>
                                                {t<any>(description)}
                                            </Typography>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    },
                )}
            </div>
        </div>
    );
}

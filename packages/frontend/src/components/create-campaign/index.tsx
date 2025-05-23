"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { Link, redirect } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";
import { AmmCampaignIcon } from "@/src/assets/amm-campaign-icon";
import classNames from "classnames";
import { CampaignType } from "@/src/types/campaign";
import { ProtocolType } from "@metrom-xyz/chains";
import { useChainId } from "wagmi";
import { RedirectType } from "next/navigation";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";

import styles from "./styles.module.css";

const CAMPAIGN_TYPES = [
    {
        path: `/campaigns/create/${CampaignType.AmmPoolLiquidity}`,
        title: "amm.title",
        description: "amm.description",
        className: styles.ammFormIcon,
        icon: <AmmCampaignIcon className={styles.ammIcon} />,
    },
    {
        path: `/campaigns/create/${CampaignType.LiquityV2}`,
        title: "liquityV2.title",
        description: "liquityV2.description",
        className: styles.liquityV2FormIcon,
        icon: <LiquityV2CampaignIcon className={styles.liquidityV2Icon} />,
    },
];

export function CreateCampaign() {
    const t = useTranslations("newCampaign.pickType");
    const locale = useLocale();

    const chainId = useChainId();
    const dexesProtocols = useProtocolsInChain(chainId, ProtocolType.Dex);
    const liquityV2Protocols = useProtocolsInChain(
        chainId,
        ProtocolType.LiquityV2,
    );

    if (dexesProtocols.length === 0)
        redirect(
            {
                href: {
                    pathname: `/campaigns/create/${CampaignType.LiquityV2}`,
                },
                locale,
            },
            RedirectType.push,
        );

    if (liquityV2Protocols.length === 0)
        redirect(
            {
                href: {
                    pathname: `/campaigns/create/${CampaignType.AmmPoolLiquidity}`,
                },
                locale,
            },
            RedirectType.push,
        );

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
                    ({ path, title, description, icon, className }) => (
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
                                        <Typography weight="medium" size="lg">
                                            {t<any>(title)}
                                        </Typography>
                                        <Typography weight="medium" light>
                                            {t<any>(description)}
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ),
                )}
            </div>
        </div>
    );
}

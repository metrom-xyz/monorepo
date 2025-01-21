"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";

import styles from "./styles.module.css";

const CAMPAIGN_TYPES = [
    {
        path: `/campaigns/create/${TargetType.AmmPoolLiquidity}`,
        title: "amm.title",
        description: "amm.description",
        // TODO: add icon
        icon: "",
    },
    {
        path: `/campaigns/create/${TargetType.LiquityV2Debt}`,
        title: "liquityV2.title",
        description: "liquityV2.description",
        icon: <LiquityV2CampaignIcon />,
    },
];

export function PickCampaignType() {
    const t = useTranslations("newCampaign.pickType");

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg" uppercase>
                {t("title")}
            </Typography>
            <Typography light size="xl2" className={styles.description}>
                {t("description")}
            </Typography>
            <div className={styles.campaignCardsWrapper}>
                {CAMPAIGN_TYPES.map(({ path, title, description, icon }) => (
                    <Link key={path} href={path}>
                        <Card className={styles.campaignCard}>
                            <div className={styles.campaignCardBody}>
                                <div className={styles.iconWrapper}>{icon}</div>
                                <Typography weight="medium" size="xl">
                                    {t(title)}
                                </Typography>
                                <Typography weight="medium" light>
                                    {t(description)}
                                </Typography>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

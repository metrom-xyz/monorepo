"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { LiquityV2CampaignIcon } from "@/src/assets/liquity-v2-campaign-icon";
import { AmmCampaignIcon } from "@/src/assets/amm-campaign-icon";
import classNames from "classnames";
import { CampaignType } from "@/src/types/campaign";

import styles from "./styles.module.css";

const CAMPAIGN_TYPES = [
    {
        enabled: true,
        path: `/campaigns/create/${CampaignType.AmmPoolLiquidity}`,
        title: "amm.title",
        description: "amm.description",
        className: styles.ammFormIcon,
        icon: <AmmCampaignIcon className={styles.ammIcon} />,
    },
    {
        enabled: true,
        path: `/campaigns/create/${CampaignType.LiquityV2}`,
        title: "liquityV2.title",
        description: "liquityV2.description",
        className: styles.liquityV2FormIcon,
        icon: <LiquityV2CampaignIcon className={styles.liquidityV2Icon} />,
    },
];

export function CreateCampaign() {
    const t = useTranslations("newCampaign.pickType");

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg" uppercase>
                {t("title")}
            </Typography>
            <Typography weight="medium" light className={styles.description}>
                {t("description")}
            </Typography>
            <div className={styles.campaignCardsWrapper}>
                {CAMPAIGN_TYPES.filter(({ enabled }) => enabled).map(
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

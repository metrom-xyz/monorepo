import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";
import { ENVIRONMENT } from "@/src/commons/env";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Lv2BannerGraphic1 } from "@/src/assets/lv2-banner-graphic-1";
import { Lv2BannerGraphic2 } from "@/src/assets/lv2-banner-graphic-2";
import { Lv2BannerGraphic3 } from "@/src/assets/lv2-banner-graphic-3";
import { TURTLE_CAMPAIGNS } from "@/src/commons/turtle-campaigns";
import { Opportunity } from "./opportunity";
import { PROJECT_PAGES } from "@/src/commons/project-pages";
import { useChainType } from "@/src/hooks/useChainType";

import styles from "./styles.module.css";

const ILLUSTRATIONS = [Lv2BannerGraphic1, Lv2BannerGraphic2, Lv2BannerGraphic3];

export function ProjectOpportunitiesBanner() {
    const t = useTranslations("projectOpportunitiesBanner");

    const chainType = useChainType();

    const lv2CampaignsActive = Object.entries(
        LV2_POINTS_CAMPAIGNS[ENVIRONMENT],
    ).some(([_, campaign]) => !!campaign && campaign?.chain.type === chainType);

    const turtleCampaignsActive = TURTLE_CAMPAIGNS[ENVIRONMENT].some(
        (campaign) => campaign.chain.type === chainType,
    );

    const protocolPages = Object.entries(PROJECT_PAGES[ENVIRONMENT]).some(
        ([_, project]) => !!project && project?.chain.type === chainType,
    );

    if (!lv2CampaignsActive && !turtleCampaignsActive && !protocolPages)
        return null;

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.container}>
                {Object.entries(LV2_POINTS_CAMPAIGNS[ENVIRONMENT]).map(
                    ([protocol, campaign], index) => {
                        if (!campaign) return null;

                        const { brand, pointsName, icon } = campaign;

                        const Illustration =
                            ILLUSTRATIONS.toReversed()[index] ||
                            ILLUSTRATIONS.toReversed()[0];

                        return (
                            <Opportunity
                                key={index}
                                name={t("campaignTitle", {
                                    pointsName,
                                })}
                                href={`/campaigns/lv2-points/${protocol}`}
                                brand={brand}
                                icon={icon}
                                illustration={Illustration}
                            />
                        );
                    },
                )}
                {Object.entries(PROJECT_PAGES[ENVIRONMENT]).map(
                    ([poject, page], index) => {
                        const { brand, name, icon } = page;

                        const Illustration =
                            ILLUSTRATIONS[index] || ILLUSTRATIONS[0];

                        return (
                            <Opportunity
                                key={index}
                                name={name}
                                href={`/projects/${poject}`}
                                icon={icon}
                                illustration={Illustration}
                                brand={brand}
                            />
                        );
                    },
                )}
                {TURTLE_CAMPAIGNS[ENVIRONMENT].map((campaign, index) => {
                    if (!campaign) return null;

                    const { id, name, brand, ownerLogo } = campaign;

                    const Illustration =
                        ILLUSTRATIONS[index] || ILLUSTRATIONS[0];

                    return (
                        <Opportunity
                            key={index}
                            name={name}
                            href={`/turtle-campaigns/${id}`}
                            icon={ownerLogo}
                            illustration={Illustration}
                            brand={brand}
                        />
                    );
                })}
            </div>
        </div>
    );
}

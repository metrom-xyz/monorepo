import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";
import { ENVIRONMENT } from "@/src/commons/env";
import { Link } from "@/src/i18n/routing";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Lv2BannerGraphic1 } from "@/src/assets/lv2-banner-graphic-1";
import { Lv2BannerGraphic2 } from "@/src/assets/lv2-banner-graphic-2";
import { Lv2BannerGraphic3 } from "@/src/assets/lv2-banner-graphic-3";
import { easeInOut, motion } from "motion/react";

import styles from "./styles.module.css";

const ILLUSTRATIONS = [Lv2BannerGraphic1, Lv2BannerGraphic2, Lv2BannerGraphic3];

export function Lv2PointsCampaignBanner() {
    const t = useTranslations("lv2PointsCampaignsBanner");

    const lv2CampaignsActive = Object.entries(
        LV2_POINTS_CAMPAIGNS[ENVIRONMENT],
    ).some(([_, campaign]) => !!campaign);

    if (!lv2CampaignsActive) return null;

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.cardsWrapper}>
                {Object.entries(LV2_POINTS_CAMPAIGNS[ENVIRONMENT]).map(
                    ([protocol, campaign], index) => {
                        if (!campaign) return null;

                        const {
                            name,
                            brand,
                            pointsName,
                            icon: Icon,
                        } = campaign;

                        const Illustration =
                            ILLUSTRATIONS[index] || ILLUSTRATIONS[0];

                        return (
                            <Link
                                key={index}
                                href={`/campaigns/lv2-points/${protocol}`}
                                className={styles.link}
                            >
                                <motion.div
                                    whileHover="animate"
                                    className={styles.card}
                                    style={{
                                        backgroundColor: brand.main,
                                    }}
                                >
                                    <motion.div
                                        variants={{
                                            initial: { y: 0 },
                                            animate: { y: -10 },
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: easeInOut,
                                        }}
                                        className={styles.illustration}
                                    >
                                        {!!Illustration && <Illustration />}
                                    </motion.div>
                                    <div
                                        className={styles.iconWrapper}
                                        style={{
                                            backgroundColor: brand.light,
                                        }}
                                    >
                                        <Icon className={styles.icon} />
                                    </div>
                                    <Typography
                                        weight="medium"
                                        uppercase
                                        size="lg"
                                        className={styles.title}
                                    >
                                        {t("campaignTitle", {
                                            pointsName,
                                        })}
                                    </Typography>
                                </motion.div>
                            </Link>
                        );
                    },
                )}
            </div>
        </div>
    );
}

import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Lv2BannerGraphic1 } from "@/src/assets/lv2-banner-graphic-1";
import { Lv2BannerGraphic2 } from "@/src/assets/lv2-banner-graphic-2";
import { Lv2BannerGraphic3 } from "@/src/assets/lv2-banner-graphic-3";
import { ArticleIcon } from "@/src/assets/article-icon";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { easeInOut, motion } from "motion/react";
import type { BrandColor, ProjectIntro } from "@/src/types/common";

import styles from "./styles.module.css";

interface ProjectIntroProps extends ProjectIntro {
    project: string;
    brand: BrandColor;
}

const ILLUSTRATIONS = [Lv2BannerGraphic1, Lv2BannerGraphic2, Lv2BannerGraphic3];

export function ProjectIntro({ project, brand, articles }: ProjectIntroProps) {
    const t = useTranslations("projectIntro");

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title", { project })}
            </Typography>
            <div className={styles.articlesWrapper}>
                {articles.map(({ title, href }, index) => {
                    const Illustration =
                        ILLUSTRATIONS[index] || ILLUSTRATIONS[0];

                    return (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            <motion.div
                                whileHover="animate"
                                className={styles.article}
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
                                <div className={styles.iconWrapper}>
                                    <ArticleIcon />
                                </div>
                                <div className={styles.rightContent}>
                                    <div className={styles.titleWrapper}>
                                        <Typography
                                            size="lg"
                                            weight="medium"
                                            uppercase
                                            className={styles.text}
                                        >
                                            {t("article")}
                                        </Typography>
                                        <ArrowRightIcon
                                            className={styles.externalLinkIcon}
                                        />
                                    </div>
                                    <Typography
                                        weight="medium"
                                        className={styles.text}
                                    >
                                        {title}
                                    </Typography>
                                </div>
                            </motion.div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

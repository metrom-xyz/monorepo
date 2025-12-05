import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { ArticleIcon } from "@/src/assets/article-icon";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import type { ProjectIntro } from "@/src/types/project";

import styles from "./styles.module.css";

type IntroProps = ProjectIntro;

export function Intro({ articles }: IntroProps) {
    const t = useTranslations("projectIntro");

    return (
        <div className={styles.root}>
            <Typography variant="tertiary" weight="medium" uppercase>
                {t("relatedArticles")}
            </Typography>
            <div className={styles.articlesWrapper}>
                {articles.map(({ title, href }, index) => {
                    return (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            <div className={styles.iconWrapper}>
                                <ArticleIcon className={styles.articleIcon} />
                            </div>
                            <div className={styles.rightContent}>
                                <Typography weight="medium">{title}</Typography>
                                <ArrowRightIcon
                                    className={styles.externalLinkIcon}
                                />
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

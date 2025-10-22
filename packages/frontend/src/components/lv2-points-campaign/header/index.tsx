import type { BrandColor, SVGIcon } from "@/src/types/common";
import type { FunctionComponent } from "react";
import { Button, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface HeaderProps {
    name: string;
    description: string;
    brand: BrandColor;
    url: string;
    icon: FunctionComponent<SVGIcon>;
}

export function Header({
    name,
    description,
    brand,
    url,
    icon: Icon,
}: HeaderProps) {
    const t = useTranslations("lv2PointsCampaignPage.header");

    return (
        <div className={styles.root}>
            <div className={styles.leftContent}>
                <div
                    className={styles.iconWrapper}
                    style={{ backgroundColor: brand.light }}
                >
                    <Icon className={styles.icon} />
                </div>
                <div className={styles.titleWrapper}>
                    <Typography weight="medium" size="xl3" uppercase>
                        {t("title", { protocol: name })}
                    </Typography>
                    <Typography weight="medium" variant="tertiary" size="sm">
                        {description}
                    </Typography>
                </div>
            </div>
            <Button
                size="sm"
                href={url}
                border={false}
                variant="secondary"
                icon={ArrowRightIcon}
                target="_blank"
                rel="noopener noreferrer"
                className={{
                    root: styles.exploreButton,
                    contentWrapper: styles.exploreButton,
                    icon: styles.externalLinkIcon,
                }}
            >
                {name}
            </Button>
        </div>
    );
}

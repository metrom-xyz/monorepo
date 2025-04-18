import type { SVGIcon } from "@/src/types/common";
import type { FunctionComponent } from "react";
import { Button, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";
import { useTranslations } from "next-intl";

interface HeaderProps {
    name: string;
    description: string;
    url: string;
    icon: FunctionComponent<SVGIcon>;
}

export function Header({ name, description, url, icon: Icon }: HeaderProps) {
    const t = useTranslations("lv2PointsCampaignPage.header");

    return (
        <div className={styles.root}>
            <div className={styles.leftContent}>
                <Icon />
                <div className={styles.titleWrapper}>
                    <Typography weight="medium" size="xl4" uppercase>
                        {t("title", { protocol: name })}
                    </Typography>
                    <Typography weight="medium" light size="sm">
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

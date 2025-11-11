import type { SVGIcon } from "@/src/types/common";
import type { FunctionComponent } from "react";
import { Button, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";
import type { Branding } from "@/src/types/project";

import styles from "./styles.module.css";

interface HeaderProps {
    name: string;
    distributor: string;
    owner: string;
    description: string;
    brand: Branding;
    url: string;
    ownerLogo: FunctionComponent<SVGIcon>;
}

export function Header({
    name,
    distributor,
    owner,
    description,
    brand,
    url,
    ownerLogo: Icon,
}: HeaderProps) {
    const t = useTranslations("turtleCampaignPage.header");

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.leftContent}>
                    <div
                        className={styles.iconWrapper}
                        style={{ backgroundColor: brand.light }}
                    >
                        <Icon className={styles.icon} />
                    </div>
                    <div className={styles.titleWrapper}>
                        <Typography weight="medium" size="xl3" uppercase>
                            {t("title", { owner })}
                        </Typography>
                        <Typography
                            weight="medium"
                            variant="tertiary"
                            size="sm"
                        >
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
            <div className={styles.actionsContainer}>
                <Button
                    size="sm"
                    href={distributor}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t("deposit")}
                </Button>
            </div>
        </div>
    );
}

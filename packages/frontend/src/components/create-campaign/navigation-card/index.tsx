import { Link } from "@/src/i18n/routing";
import { Typography } from "@metrom-xyz/ui";
import type { ReactNode } from "react";

import styles from "./styles.module.css";
import classNames from "classnames";

interface NavigationCardProps {
    href: string;
    title: string;
    description: string;
    icon: ReactNode;
    tags?: string[];
}

export function NavigationCard({
    href,
    title,
    description,
    icon,
    tags,
}: NavigationCardProps) {
    return (
        <Link href={href} className={styles.root}>
            <div className={styles.card}>
                <div className={styles.body}>
                    <div className={styles.iconWrapper}>{icon}</div>
                    <div className={styles.rightContent}>
                        <Typography weight="medium" size="lg" uppercase>
                            {title}
                        </Typography>
                        <Typography size="sm" variant="tertiary">
                            {description}
                        </Typography>
                    </div>
                </div>
                {tags && (
                    <div className={styles.tags}>
                        {tags.map((tag) => (
                            <div key={tag} className={styles.tag}>
                                <Typography size="xs" weight="medium" uppercase>
                                    {tag}
                                </Typography>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

export function SkeletonNavigationCard() {
    return <div className={classNames(styles.card, styles.loading)}></div>;
}

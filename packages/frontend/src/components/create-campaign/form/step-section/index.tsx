import type { ReactNode } from "react";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface StepSectionProps {
    title: string;
    headerDecorator?: ReactNode;
    description?: string;
    optional?: boolean;
    children: ReactNode;
}

export function StepSection({
    title,
    headerDecorator,
    description,
    optional,
    children,
}: StepSectionProps) {
    const t = useTranslations("newCampaign");

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <Typography weight="semibold">{title}</Typography>
                    {headerDecorator}
                    {optional && (
                        <div className={styles.optionalTag}>
                            <Typography
                                size="xs"
                                weight="medium"
                                variant="tertiary"
                            >
                                {t("optional")}
                            </Typography>
                        </div>
                    )}
                </div>
                {description && (
                    <Typography size="xs" variant="tertiary">
                        {description}
                    </Typography>
                )}
            </div>
            {children}
        </div>
    );
}

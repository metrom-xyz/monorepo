import { type ReactNode } from "react";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface FormStepSectionProps {
    title: string;
    headerDecorator?: ReactNode;
    description?: ReactNode;
    optional?: boolean;
    children: ReactNode;
}

export function FormStepSection({
    title,
    headerDecorator,
    description,
    optional,
    children,
}: FormStepSectionProps) {
    const t = useTranslations("newCampaign");

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <Typography size="sm" weight="medium">{title}</Typography>
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
                    {headerDecorator}
                </div>
                {description}
            </div>
            {children}
        </div>
    );
}

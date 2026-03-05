import { Card, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { FunctionComponent } from "react";
import { SVGIcon } from "@/types/common";
import { formatUsdAmount } from "@/utils/format";

import styles from "./styles.module.css";

interface OverviewProps {
    loading: boolean;
    chain?: string;
    icon?: FunctionComponent<SVGIcon>;
    totalUsd?: number;
}

export function Overview({
    loading,
    chain,
    icon: Icon,
    totalUsd,
}: OverviewProps) {
    const t = useTranslations("overview");

    return (
        <Card className={styles.root}>
            <TextField
                label={t("chain")}
                loading={loading}
                size="xl3"
                value={
                    <div className={styles.field}>
                        {Icon && <Icon className={styles.icon} />}
                        <Typography size="xl3" weight="medium">
                            {chain}
                        </Typography>
                    </div>
                }
            />
            <TextField
                label={t("unclaimed")}
                loading={loading}
                size="xl3"
                value={
                    <Typography size="xl3" weight="medium">
                        {formatUsdAmount({ amount: totalUsd })}
                    </Typography>
                }
            />
        </Card>
    );
}

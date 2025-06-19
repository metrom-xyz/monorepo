import { Button, Card, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { FunctionComponent } from "react";
import { SVGIcon } from "@/types/common";
import { formatUsdAmount } from "@/utils/format";

import styles from "./styles.module.css";

interface OverviewProps {
    chain?: string;
    icon?: FunctionComponent<SVGIcon>;
    totalUsd?: number;
}

// TODO: add loading state
export function Overview({ chain, icon: Icon, totalUsd }: OverviewProps) {
    const t = useTranslations("overview");

    return (
        <Card className={styles.root}>
            <TextField
                label={t("chain")}
                value={
                    <div className={styles.field}>
                        {Icon && <Icon className={styles.icon} />}
                        <Typography size="xl4" weight="medium">
                            {chain}
                        </Typography>
                    </div>
                }
            />
            <TextField
                label={t("chain")}
                value={
                    <Typography size="xl4" weight="medium">
                        {formatUsdAmount({ amount: totalUsd })}
                    </Typography>
                }
            />
            <Button size="sm">{t("claimAll")}</Button>
        </Card>
    );
}

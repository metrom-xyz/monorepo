import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { LiquityV2Action, type LiquityV2CampaignPayload } from "@/src/types";
import { Row, RowSkeleton } from "./row";

import styles from "./styles.module.css";

interface CollateralsListProps {
    loading?: boolean;
    action?: LiquityV2CampaignPayload["action"];
    selected?: LiquityV2CampaignPayload["collateral"];
    collaterals?: LiquityV2Collateral[];
    onChange: (collateral: LiquityV2Collateral) => void;
}

export function CollateralsList({
    loading,
    action,
    selected,
    collaterals,
    onChange,
}: CollateralsListProps) {
    const t = useTranslations("newCampaign.form.liquityV2.collaterals");

    return (
        <div className={styles.root}>
            <div className={styles.listHeader}>
                <Typography uppercase size="sm" weight="medium" light>
                    {t("list.token")}
                </Typography>
                <Typography uppercase size="sm" weight="medium" light>
                    {t(
                        action === LiquityV2Action.Debt
                            ? "list.debt"
                            : "list.deposits",
                    )}
                </Typography>
            </div>
            {loading ? (
                <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                </>
            ) : collaterals && collaterals.length > 0 ? (
                collaterals.map((collateral) => {
                    return (
                        <Row
                            key={collateral.token.address}
                            action={action}
                            selected={collateral == selected}
                            collateral={collateral}
                            onChange={onChange}
                        />
                    );
                })
            ) : (
                <div className={styles.empty}>
                    {/* TODO: add illustration */}
                    <Typography>{t("list.empty")}</Typography>
                </div>
            )}
        </div>
    );
}

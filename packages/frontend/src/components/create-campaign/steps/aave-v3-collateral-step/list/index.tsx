import type { AaveV3Collateral } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Row, RowSkeleton } from "./row";
import { CampaignKind, type AaveV3CampaignPayload } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface CollateralsListProps {
    loading?: boolean;
    action?: CampaignKind;
    selected?: AaveV3CampaignPayload["collateral"];
    collaterals?: AaveV3Collateral[];
    onChange: (collateral: AaveV3Collateral) => void;
}

export function CollateralsList({
    loading,
    action,
    selected,
    collaterals,
    onChange,
}: CollateralsListProps) {
    const t = useTranslations("newCampaign.form.aaveV3.collaterals");

    return (
        <div className={styles.root}>
            <div className={styles.listHeader}>
                <Typography uppercase size="sm" weight="medium" light>
                    {t("list.token")}
                </Typography>
                <Typography uppercase size="sm" weight="medium" light>
                    {t(
                        action === CampaignKind.AaveV3Borrow
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

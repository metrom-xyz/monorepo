import { type AaveV3Collateral, CampaignKind } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Row, RowSkeleton } from "./row";
import { type AaveV3CampaignPayload } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface CollateralsListProps {
    loading?: boolean;
    kind?: CampaignKind;
    selected?: AaveV3CampaignPayload["collateral"];
    collaterals?: AaveV3Collateral[];
    onChange: (collateral: AaveV3Collateral) => void;
}

export function CollateralsList({
    loading,
    kind,
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
                        kind === CampaignKind.AaveV3Borrow
                            ? "list.debt"
                            : kind === CampaignKind.AaveV3NetSupply
                              ? "list.netDeposits"
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
                            kind={kind}
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

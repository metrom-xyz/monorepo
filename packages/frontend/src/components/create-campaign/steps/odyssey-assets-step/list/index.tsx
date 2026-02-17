import { type OdysseyAsset } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Row, RowSkeleton } from "./row";
import {
    ODYSSEY_BORROW_STRATEGIES,
    type OdysseyStrategyData,
} from "@/src/commons/odyssey";

import styles from "./styles.module.css";

interface AssetsListProps {
    loading?: boolean;
    strategy?: OdysseyStrategyData;
    selected?: OdysseyAsset;
    assets?: OdysseyAsset[];
    onChange: (asset: OdysseyAsset) => void;
}

export function AssetsList({
    loading,
    strategy,
    selected,
    assets,
    onChange,
}: AssetsListProps) {
    const t = useTranslations("newCampaign.form.odyssey.assets");

    return (
        <div className={styles.root}>
            <div className={styles.listHeader}>
                <Typography
                    uppercase
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                >
                    {t("list.token")}
                </Typography>
                {strategy && (
                    <Typography
                        uppercase
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                    >
                        {t(
                            ODYSSEY_BORROW_STRATEGIES.includes(strategy.id)
                                ? "list.deposited"
                                : "list.allocated",
                        )}
                    </Typography>
                )}
            </div>
            {loading ? (
                <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                </>
            ) : assets && assets.length > 0 ? (
                assets.map((asset) => {
                    return (
                        <Row
                            key={asset.address}
                            strategy={strategy}
                            selected={asset == selected}
                            asset={asset}
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

import { useLiquityV2Collaterals } from "@/src/hooks/useLiquityV2Collaterals";
import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import AutoSizer from "react-virtualized-auto-sizer";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { FixedSizeList } from "react-window";
import { useRef } from "react";
import type { LiquityV2CampaignPayload } from "@/src/types";
import { Row, RowSkeleton } from "./row";

import styles from "./styles.module.css";

interface CollateralsListProps {
    collaterals?: LiquityV2CampaignPayload["collaterals"];
    brand?: LiquityV2CampaignPayload["brand"];
    onAdd: (collateral: LiquityV2Collateral) => void;
    onRemove: (collateral: LiquityV2Collateral) => void;
}

export function CollateralsList({
    collaterals,
    brand,
    onAdd,
    onRemove,
}: CollateralsListProps) {
    const t = useTranslations("newCampaign.form.liquityV2.collaterals");
    const listRef = useRef(null);
    const chainId = useChainId();
    const { collaterals: supportedCollaterals, loading } =
        useLiquityV2Collaterals(chainId, brand?.slug);

    return (
        <div>
            <div className={styles.listWrapper}>
                <div className={styles.listHeader}>
                    <Typography uppercase size="sm" weight="medium" light>
                        {t("list.token")}
                    </Typography>
                    <Typography uppercase size="sm" weight="medium" light>
                        {t("list.tvl")}
                    </Typography>
                </div>
                <div>
                    {loading ? (
                        <>
                            <RowSkeleton />
                            <RowSkeleton />
                            <RowSkeleton />
                        </>
                    ) : supportedCollaterals &&
                      supportedCollaterals.length > 0 ? (
                        supportedCollaterals.map((collateral) => {
                            const selected = collaterals?.find(
                                ({ token }) =>
                                    token.address === collateral.token.address,
                            );

                            return (
                                <Row
                                    key={collateral.token.address}
                                    selected={!!selected}
                                    collateral={collateral}
                                    onAdd={onAdd}
                                    onRemove={onRemove}
                                />
                            );
                        })
                    ) : (
                        <div className={styles.emptyList}>
                            {/* TODO: add illustration */}
                            <Typography>{t("list.empty")}</Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

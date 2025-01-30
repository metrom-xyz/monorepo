import { useLiquityV2Collaterals } from "@/src/hooks/useLiquityV2Collaterals";
import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
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
    const chainId = useChainId();
    const { collaterals: supportedCollaterals, loading } =
        useLiquityV2Collaterals(chainId, brand?.slug);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography uppercase size="sm" weight="medium" light>
                    {t("list.select")}
                </Typography>
                <Typography uppercase size="sm" weight="medium" light>
                    {t("list.token")}
                </Typography>
            </div>
            {loading ? (
                <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                </>
            ) : supportedCollaterals && supportedCollaterals.length > 0 ? (
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
                <div className={styles.empty}>
                    {/* TODO: add illustration */}
                    <Typography>{t("list.empty")}</Typography>
                </div>
            )}
        </div>
    );
}

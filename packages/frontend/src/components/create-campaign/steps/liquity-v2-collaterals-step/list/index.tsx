import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { LiquityV2CampaignPayload } from "@/src/types";
import { Row } from "./row";

import styles from "./styles.module.css";

interface CollateralsListProps {
    filters?: LiquityV2CampaignPayload["filters"];
    supported?: LiquityV2CampaignPayload["supportedCollaterals"];
    onAdd: (collateral: LiquityV2Collateral) => void;
    onRemove: (collateral: LiquityV2Collateral) => void;
}

export function CollateralsList({
    filters,
    supported,
    onAdd,
    onRemove,
}: CollateralsListProps) {
    const t = useTranslations("newCampaign.form.liquityV2.collaterals");

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
            {supported && supported.length > 0 ? (
                supported.map((collateral) => {
                    const selected = filters?.find(
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

import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { LiquityV2Action, type LiquityV2CampaignPayload } from "@/src/types";
import { Row } from "./row";

import styles from "./styles.module.css";

interface CollateralsListProps {
    action?: LiquityV2CampaignPayload["action"];
    selected?: LiquityV2CampaignPayload["collateral"];
    supported?: LiquityV2CampaignPayload["supportedCollaterals"];
    onChange: (collateral: LiquityV2Collateral) => void;
}

export function CollateralsList({
    action,
    selected,
    supported,
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
            {supported && supported.length > 0 ? (
                supported.map((collateral) => {
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

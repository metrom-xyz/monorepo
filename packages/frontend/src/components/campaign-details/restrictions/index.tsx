import { RestrictionType } from "@metrom-xyz/sdk";
import type { Address } from "viem";
import { useTranslations } from "next-intl";
import { Accordion, InfoTooltip, Typography } from "@metrom-xyz/ui";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";

import styles from "./styles.module.css";

interface RestrictionsProps {
    type: RestrictionType;
    list: Address[];
}

export function Restrictions({ type, list }: RestrictionsProps) {
    const t = useTranslations("campaignDetails.restrictions");

    if (type === RestrictionType.Blacklist) return;

    return (
        <div className={styles.root}>
            <div className={styles.titleWrapper}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                <InfoTooltip placement="top-start">
                    <Typography size="sm" variant="tertiary"className={styles.tooltipText}>
                        {t.rich("tooltip.allows", {
                            bold: (chunks) => (
                                <span className={styles.bold}>{chunks}</span>
                            ),
                        })}
                    </Typography>
                </InfoTooltip>
            </div>
            <Accordion title={t("allows", { count: list.length })}>
                <div className={styles.list}>
                    {list.map((address) => (
                        <div key={address} className={styles.row}>
                            <div className={styles.account}>
                                <Avatar
                                    address={address}
                                    width={20}
                                    height={20}
                                />
                                <Account
                                    variant="full"
                                    weight="medium"
                                    address={address}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Accordion>
        </div>
    );
}

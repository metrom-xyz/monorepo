import type { BaseCampaignPayload } from "@/src/types/campaign";
import { Accordion, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { RestrictionType } from "@/src/types/common";
import { useMemo } from "react";
import { Avatar } from "@/src/components/avatar/avatar";
import { Account } from "@/src/components/account";

import styles from "./styles.module.css";

interface RestrictionsProps {
    restrictions: BaseCampaignPayload["restrictions"];
}

export function Restrictions({ restrictions }: RestrictionsProps) {
    const t = useTranslations("campaignPreview.restrictions");

    const accordionTitle = useMemo(() => {
        if (!restrictions) return undefined;

        const { type, list } = restrictions;
        return type === RestrictionType.Blacklist
            ? t("blocks", { count: list.length })
            : t("allows", { count: list.length });
    }, [restrictions, t]);

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium">
                {t("title")}
            </Typography>
            <Accordion title={accordionTitle} className={styles.chartWrapper}>
                <div className={styles.list}>
                    {restrictions?.list.map((address) => (
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

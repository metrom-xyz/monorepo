"use client";

import { Typography } from "@/src/ui/typography";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { useAvailableAmms } from "@/src/hooks/useAvailableAmms";
import { Campaign } from "./campaign";

import styles from "./styles.module.css";
import { useTranslations } from "next-intl";

export function Campaigns() {
    const t = useTranslations();
    const amms = useAvailableAmms();

    const { loading, campaigns } = useCampaigns();

    return (
        // TODO: use i18n here
        <div className={styles.root}>
            <div className={styles.row}>
                <Typography variant="sm" light weight="medium">
                    {t("allCampaigns.header.chain")}
                </Typography>
                <Typography variant="sm" light weight="medium">
                    {t("allCampaigns.header.pool")}
                </Typography>
                <Typography variant="sm" light weight="medium">
                    {t("allCampaigns.header.status")}
                </Typography>
                <Typography variant="sm" light weight="medium">
                    {t("allCampaigns.header.apr")}
                </Typography>
                <Typography variant="sm" light weight="medium">
                    {t("allCampaigns.header.rewards")}
                </Typography>
            </div>
            <div className={styles.body}>
                {loading
                    ? "Loading..."
                    : campaigns.map((campaign) => {
                          return (
                              <Campaign
                                  key={campaign.id}
                                  amms={amms}
                                  campaign={campaign}
                                  className={`${styles.row} ${styles.bodyRow}`}
                              />
                          );
                      })}
            </div>
        </div>
    );
}

"use client";

import { Typography } from "@/src/ui/typography";
import styles from "./styles.module.css";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { useState } from "react";
import { useAvailableAmms } from "@/src/hooks/useAvailableAmms";
import { Campaign } from "./campaign";

const PAGE_SIZE = 10;

export function Campaigns() {
    const [pageNumber, setPageNumber] = useState(1);
    const amms = useAvailableAmms();

    const { loading, campaigns } = useCampaigns(pageNumber, PAGE_SIZE);

    return (
        // TODO: use i18n here
        <div className={styles.root}>
            <div className={styles.row}>
                <Typography variant="sm" light weight="medium">
                    Pool
                </Typography>
                <Typography variant="sm" light weight="medium">
                    Status
                </Typography>
                <Typography variant="sm" light weight="medium">
                    APR
                </Typography>
                <Typography variant="sm" light weight="medium">
                    Rewards
                </Typography>
            </div>
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
    );
}

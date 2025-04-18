import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";
import { ENVIRONMENT } from "@/src/commons/env";
import { Link } from "@/src/i18n/routing";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export function Lv2PointsCampaignBanner() {
    return (
        <div className={styles.root}>
            {Object.entries(LV2_POINTS_CAMPAIGNS[ENVIRONMENT]).map(
                ([protocol, campaign], index) => {
                    if (campaign)
                        return (
                            <Link
                                key={index}
                                href={`/campaigns/lv2-points/${protocol}`}
                            >
                                <div
                                    className={styles.card}
                                    // style={{
                                    //     backgroundColor: campaign.brandColor,
                                    // }}
                                >
                                    <campaign.icon />
                                    <Typography>{campaign.name}</Typography>
                                </div>
                            </Link>
                        );
                },
            )}
        </div>
    );
}

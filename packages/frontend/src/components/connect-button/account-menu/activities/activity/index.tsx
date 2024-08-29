import { ClaimReward } from "@/src/assets/claim-reward";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import type { Activity } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { Typography } from "@/src/ui/typography";
import Link from "next/link";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";
import classNames from "@/src/utils/classes";

interface ActivityProps extends Activity {
    chainId: number;
}

// TODO: finish this
export function Activity({ chainId, transaction, payload }: ActivityProps) {
    const t = useTranslations("accountMenu.activities");
    const locale = useLocale();

    const time = dayjs.unix(transaction.timestamp).to(dayjs(), true);
    const timeAgo = t("timeAgo", { time });

    const { Icon, title } =
        payload.type === "createCampaign"
            ? {
                  Icon: NewCampaignIcon,
                  title: t("createCampaign"),
              }
            : {
                  Icon: ClaimReward,
                  title: t("claimReward"),
              };

    return (
        <div className={styles.root}>
            <div className={styles.leftWrapper}>
                <div className={styles.iconWrapper}>
                    <Icon className={styles.icon} />
                </div>
                <div className={styles.leftBodyWrapper}>
                    <Typography light weight="medium">
                        {title}
                    </Typography>
                    {payload.type === "createCampaign" ? (
                        <Link
                            href={`/${locale}/campaigns/${chainId}/${payload.id}`}
                        >
                            <Typography className={styles.seeCampaignLink}>
                                {t("seeCampaign")}
                            </Typography>
                        </Link>
                    ) : (
                        <div>TODO</div>
                    )}
                </div>
            </div>
            <Typography light>{timeAgo}</Typography>
        </div>
    );
}

export function SkeletonActivity() {
    return (
        <div className={styles.root}>
            <div className={styles.leftWrapper}>
                <Skeleton
                    className={classNames(styles.iconWrapper, styles.skeleton)}
                />
                <div className={styles.leftBodyWrapper}>
                    <Skeleton width={60} className={styles.skeleton} />
                    <Skeleton width={140} className={styles.skeleton} />
                </div>
            </div>
            <Skeleton width={50} className={styles.skeleton} />
        </div>
    );
}

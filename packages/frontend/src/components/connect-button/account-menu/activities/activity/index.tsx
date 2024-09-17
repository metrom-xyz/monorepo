import { ClaimReward } from "@/src/assets/claim-reward";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import type { Activity } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import classNames from "classnames";
import { formatTokenAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface ActivityProps extends Activity {
    chainId: number;
}

export function Activity({ chainId, transaction, payload }: ActivityProps) {
    const t = useTranslations("accountMenu.activities");

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

    function handleActivityOnClick() {
        trackFathomEvent("CLICK_ACTIVITY");
    }

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
                            href={`/campaigns/${chainId}/${payload.id}`}
                            onClick={handleActivityOnClick}
                        >
                            <Typography className={styles.seeCampaignLink}>
                                {t("seeCampaign")}
                            </Typography>
                        </Link>
                    ) : (
                        <div className={styles.claimRewardWrapper}>
                            <RemoteLogo
                                size="sm"
                                chain={chainId}
                                address={payload.token.address}
                                defaultText={payload.token.symbol}
                            />
                            <Typography>{payload.token.symbol}</Typography>
                            <Typography>
                                {formatTokenAmount({ amount: payload.amount })}
                            </Typography>
                        </div>
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

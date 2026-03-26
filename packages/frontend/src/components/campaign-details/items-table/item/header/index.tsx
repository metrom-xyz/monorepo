import { CampaignTagsGroup } from "@/src/components/campaign-tags-group";
import { CampaignTag } from "@/src/components/campaign-tag";
import { Typography } from "@metrom-xyz/ui";
import { CampaignRewardsPopover } from "@/src/components/campaign-rewards-popover";
import { formatDateTime, formatUsdAmount } from "@/src/utils/format";
import { CampaignWeighting } from "@/src/components/campaign-weighting";
import type { CampaignItem } from "@/src/types/campaign";
import { DistributablesType, Status, TargetType } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { CalendarIcon } from "@/src/assets/calendar-icon";

import styles from "./styles.module.css";

interface HeaderProps {
    campaignItem: CampaignItem;
}

export function Header({ campaignItem }: HeaderProps) {
    const t = useTranslations("campaignDetails.itemsTable.campaignItem");

    const ammPoolItem = campaignItem.isTargeting(TargetType.AmmPoolLiquidity);
    const notExpired = campaignItem.status !== Status.Expired;

    const rewards = campaignItem.isDistributing(DistributablesType.Tokens);
    const { from, to, status, chainId, specification } = campaignItem;

    return (
        <div className={styles.root}>
            <CampaignTagsGroup>
                {rewards && notExpired && (
                    <>
                        <CampaignTag
                            variant="secondary"
                            text={
                                <div className={styles.tag}>
                                    <Typography size="sm" variant="tertiary">
                                        {t("tokens")}
                                    </Typography>
                                    <CampaignRewardsPopover
                                        logoSize="xs"
                                        hideSymbol
                                        hideOnExpired
                                        hideUsdValue
                                        status={status}
                                        chainId={chainId}
                                        distributables={
                                            campaignItem.distributables
                                        }
                                    />
                                </div>
                            }
                        />
                        <CampaignTag
                            variant="secondary"
                            text={
                                <Typography size="sm" variant="tertiary">
                                    {t.rich("dailyRewards", {
                                        usdValue: formatUsdAmount({
                                            amount: campaignItem.distributables
                                                .dailyUsd,
                                        }),
                                        highlighted: (chunks) => (
                                            <span
                                                className={
                                                    styles.higlightedText
                                                }
                                            >
                                                {chunks}
                                            </span>
                                        ),
                                    })}
                                </Typography>
                            }
                        />
                    </>
                )}
            </CampaignTagsGroup>
            <CampaignTag
                variant="secondary"
                text={
                    <div className={styles.tag}>
                        <CalendarIcon className={styles.calendarIcon} />
                        <Typography size="sm" weight="medium">
                            {`${formatDateTime(from)} - ${formatDateTime(to)}`}
                        </Typography>
                    </div>
                }
            />
            {specification && specification.weighting && ammPoolItem && (
                <CampaignWeighting
                    specification={specification}
                    pool={campaignItem.target.pool}
                />
            )}
        </div>
    );
}

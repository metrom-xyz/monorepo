import { CampaignTagsGroup } from "@/src/components/campaign-tags-group";
import { CampaignTag } from "@/src/components/campaign-tag";
import { Typography } from "@metrom-xyz/ui";
import { CampaignRewardsPopover } from "@/src/components/campaign-rewards-popover";
import { formatDateTime, formatUsdAmount } from "@/src/utils/format";
import { CampaignWeighting } from "@/src/components/campaign-weighting";
import type { AggregatedCampaignItem } from "@/src/types/campaign";
import { DistributablesType, Status, TargetType } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { CalendarIcon } from "@/src/assets/calendar-icon";

import styles from "./styles.module.css";

interface HeaderProps {
    item: AggregatedCampaignItem;
}

export function Header({ item }: HeaderProps) {
    const t = useTranslations("campaignDetails.itemsTable.item");

    const ammPoolItem = item.isTargeting(TargetType.AmmPoolLiquidity);
    const notExpired = item.status !== Status.Expired;

    const rewards = item.isDistributing(DistributablesType.Tokens);
    const { from, to, status, chainId, specification } = item;

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
                                        distributables={item.distributables}
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
                                            amount: item.distributables
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
                    pool={item.target.pool}
                />
            )}
        </div>
    );
}

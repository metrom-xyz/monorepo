import { RemoteLogo } from "@/src/components/remote-logo";
import classNames from "classnames";
import type { Action } from "@/src/types/lv2-points-campaign";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { InfoTooltip, Typography } from "@metrom-xyz/ui";
import { TimeProgressIcon } from "@/src/assets/time-progress-icon";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import type { ChainWithType } from "@/src/types/chain";

import styles from "./styles.module.css";

interface ActionProps extends Action {
    chain: ChainWithType;
}

export function Action({
    chain,
    name,
    description,
    targets,
    multiplier,
    tooltip,
    minimumDuration,
    href,
}: ActionProps) {
    const t = useTranslations("lv2PointsCampaignPage.action");

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(styles.root, {
                [styles.link]: !!href,
            })}
        >
            <div className={styles.target}>
                {targets.length === 0 ? null : targets.length === 1 ? (
                    <RemoteLogo
                        size="sm"
                        chain={chain.id}
                        address={targets[0]}
                    />
                ) : (
                    <PoolRemoteLogo
                        size="sm"
                        chain={chain.id}
                        tokens={targets.map((target) => ({
                            address: target,
                        }))}
                    />
                )}
                <div className={styles.text}>
                    <Typography weight="medium">{name}</Typography>
                    {description && (
                        <Typography weight="medium" variant="tertiary"uppercase size="xs">
                            {description}
                        </Typography>
                    )}
                </div>
            </div>
            <div className={styles.details}>
                {!!minimumDuration && (
                    <InfoTooltip
                        placement="top"
                        icon={<TimeProgressIcon height={20} width={20} />}
                        className={styles.infoTooltip}
                    >
                        <Typography size="sm">
                            {t.rich(tooltip || "minimumDuration", {
                                time: dayjs
                                    .duration(minimumDuration, "seconds")
                                    .humanize(),
                                bold: (chunks) => (
                                    <span className={styles.boldText}>
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </Typography>
                    </InfoTooltip>
                )}
                <Typography weight="medium">{`${multiplier}x`}</Typography>
            </div>
        </a>
    );
}

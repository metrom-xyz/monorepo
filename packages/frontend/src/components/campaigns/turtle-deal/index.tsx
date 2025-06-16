import { Link } from "@/src/i18n/routing";
import type { TurtleDeal } from "@/src/types/turtle";
import { Card, InfoTooltip, Typography } from "@metrom-xyz/ui";
import { Chain } from "../campaign/chain";
import { TurtleLogo } from "@/src/assets/logos/protocols/turtle";
import { Status as StatusState } from "@metrom-xyz/sdk";
import { RemoteLogo } from "../../remote-logo";
import { Status } from "../campaign/status";
import { AprChip } from "../../apr-chip";
import { useTranslations } from "next-intl";
// import { TURTLE_PARTNER_ICONS } from "@metrom-xyz/chains";
import classNames from "classnames";

import styles from "./styles.module.css";

interface TurtleDealRowProps {
    campaignId: string;
    deal: TurtleDeal;
}

export function TurtleDealRow({ campaignId, deal }: TurtleDealRowProps) {
    const t = useTranslations("allCampaigns.turtleDeal");

    const { data, metadata, token, underlying_tokens } = deal;

    // FIXME: not ideal, find a better way
    const owner = metadata.name.split(" ")[0];
    // const PartnerLogo = TURTLE_PARTNER_ICONS[owner.toLowerCase()];

    return (
        <Link
            href={`/turtle-deals/${campaignId}/${metadata.id}`}
            className={styles.root}
        >
            <Card className={styles.card}>
                <Chain id={token.chain} />
                <TurtleLogo className={styles.icon} />
                <div className={styles.action}>
                    <RemoteLogo src={deal.metadata.iconUrl} />
                    <div className={styles.title}>
                        <Typography size="lg" weight="medium" truncate>
                            {t("action", {
                                tokens: underlying_tokens
                                    .map(({ symbol }) => symbol)
                                    .join(", "),
                                owner,
                            })}
                        </Typography>
                        <InfoTooltip placement="top">
                            <Typography size="sm">
                                {metadata.description}
                            </Typography>
                        </InfoTooltip>
                    </div>
                </div>
                <Status
                    status={StatusState.Live}
                    from={0}
                    to={0}
                    showDuration={false}
                />
                <AprChip apr={data.apy * 100} />
                <div className={styles.rewards}>
                    {underlying_tokens.map((token, i) => {
                        return (
                            <div
                                key={token.address}
                                style={{ zIndex: i }}
                                className={styles.rewardIcon}
                            >
                                <RemoteLogo src={token.logos[0]} />
                            </div>
                        );
                    })}
                    {/* {!!PartnerLogo && (
                        <PartnerLogo
                            className={classNames(
                                styles.partnerIcon,
                                styles.rewardIcon,
                            )}
                        />
                    )} */}
                </div>
            </Card>
        </Link>
    );
}

import { RestrictionType } from "@metrom-xyz/sdk";
import type { Address } from "viem";
import { useTranslations } from "next-intl";
import { Accordion, Pointer, Typography } from "@metrom-xyz/ui";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import classNames from "classnames";
import { useAccount } from "@/src/hooks/useAccount";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

interface RestrictionsProps {
    type: RestrictionType;
    list: Address[];
}

export function Restrictions({ type, list }: RestrictionsProps) {
    const t = useTranslations("campaignDetails.restrictions");

    const { width } = useWindowSize();
    const { address: connectedAddress } = useAccount();
    const blacklist = type === RestrictionType.Blacklist;

    return (
        <Accordion
            title={
                <div className={styles.titleWrapper}>
                    <Typography weight="medium" uppercase>
                        {t("restrictions")}
                    </Typography>
                    <div
                        className={classNames(styles.dot, {
                            [styles[type]]: true,
                        })}
                    ></div>
                    <Typography
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {t(blacklist ? "blocked" : "allowed", {
                            count: list.length,
                        })}
                    </Typography>
                </div>
            }
            className={styles.root}
        >
            <div className={styles.list}>
                {list.map((address) => {
                    const connected =
                        connectedAddress?.toLowerCase() ===
                        address.toLowerCase();

                    return (
                        <div
                            key={address}
                            className={classNames(styles.row, {
                                [styles.connected]: connected,
                            })}
                        >
                            <div className={styles.account}>
                                <Avatar
                                    address={address}
                                    width={20}
                                    height={20}
                                />
                                <Account
                                    variant={width < 640 ? "short" : "full"}
                                    weight="medium"
                                    address={address}
                                />
                                {connected && (
                                    <Pointer
                                        size="sm"
                                        uppercase
                                        color={blacklist ? "red" : "green"}
                                        text={
                                            blacklist
                                                ? t("addressBlocked")
                                                : t("addressAllowed")
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Accordion>
    );
}

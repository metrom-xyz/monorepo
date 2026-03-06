import { RestrictionType } from "@metrom-xyz/sdk";
import type { Address } from "viem";
import { useTranslations } from "next-intl";
import { Pointer, Typography } from "@metrom-xyz/ui";
import { Avatar } from "../../../../avatar/avatar";
import { Account } from "../../../../account";
import classNames from "classnames";
import { useAccount } from "@/src/hooks/useAccount";

import styles from "./styles.module.css";

interface RestrictionsProps {
    type: RestrictionType;
    list: Address[];
}

export function Restrictions({ type, list }: RestrictionsProps) {
    const t = useTranslations("campaignDetails.restrictions");

    const { address: connectedAddress } = useAccount();
    const blacklist = type === RestrictionType.Blacklist;

    return (
        <div className={styles.root}>
            <div className={styles.titleWrapper}>
                <div
                    className={classNames(styles.dot, {
                        [styles[type]]: true,
                    })}
                ></div>
                <Typography size="sm" weight="medium">
                    {t.rich(blacklist ? "blocked" : "allowed", {
                        count: list.length,
                        highlighted: (chunks) => (
                            <span
                                className={
                                    blacklist ? styles.red : styles.green
                                }
                            >
                                {chunks}
                            </span>
                        ),
                    })}
                </Typography>
            </div>
            <div className={styles.list}>
                {list.map((address) => {
                    const connected =
                        connectedAddress?.toLowerCase() ===
                        address.toLowerCase();

                    return (
                        <div
                            key={address}
                            className={classNames(styles.restriction, {
                                [styles[type]]: true,
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
                                    length="long"
                                    weight="medium"
                                    address={address}
                                />
                            </div>
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
                    );
                })}
            </div>
        </div>
    );
}

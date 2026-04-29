import { RestrictionType, type Restrictions } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { Dot } from "../../inputs/restrictions-picker/dot";
import { useTranslations } from "next-intl";
import { useState } from "react";
import classNames from "classnames";
import { Avatar } from "@/src/components/avatar/avatar";
import { Account } from "@/src/components/account";

import styles from "./styles.module.css";

interface AddressRestrictionsProps {
    restrictions: Restrictions;
}

export function AddressRestrictions({
    restrictions,
}: AddressRestrictionsProps) {
    const [showMore, setShowMore] = useState(false);

    const t = useTranslations("newCampaign.formPreview");

    function handleOnShowMoreToggle() {
        setShowMore((prev) => !prev);
    }

    return (
        <div className={styles.restrictions}>
            <Typography size="xs" weight="medium" variant="tertiary">
                {t("addressRestrictions")}
            </Typography>
            <div className={styles.restrictionsHeader}>
                <div className={styles.restrictionsTitle}>
                    <Dot
                        color={
                            restrictions.type === RestrictionType.Blacklist
                                ? "red"
                                : "green"
                        }
                    />
                    <Typography size="sm" weight="medium">
                        {t(
                            restrictions.type === RestrictionType.Blacklist
                                ? "blockedAddresses"
                                : "allowedAddresses",
                            {
                                count: restrictions.list.length,
                            },
                        )}
                    </Typography>
                </div>
                <Typography
                    size="xs"
                    weight="semibold"
                    variant="secondary"
                    onClick={handleOnShowMoreToggle}
                    className={styles.showText}
                >
                    {t(showMore ? "showLess" : "showMore")}
                </Typography>
            </div>
            {showMore && (
                <div className={styles.restrictedAddresses}>
                    {restrictions.list.map((address) => (
                        <div key={address} className={styles.restrictedAddress}>
                            <div
                                className={classNames(styles.avatarBorder, {
                                    [styles[restrictions.type]]: true,
                                })}
                            >
                                <Avatar
                                    address={address}
                                    width={16}
                                    height={16}
                                />
                            </div>
                            <Account
                                size="xs"
                                length="long"
                                weight="medium"
                                variant="tertiary"
                                address={address}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

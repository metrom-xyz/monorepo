import classNames from "classnames";
import type { RestrictionType } from "@metrom-xyz/sdk";
import type { Address } from "viem";
import { Avatar } from "@/src/components/avatar/avatar";
import { Account } from "@/src/components/account";
import { TrashIcon } from "@/src/assets/trash-icon";
import { useCallback, useRef, useState } from "react";
import { Popover, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface RestrictedAddressProps {
    type: RestrictionType;
    address: Address;
    onRemove: (address: Address) => void;
}

export function RestrictedAddress({
    type,
    address,
    onRemove,
}: RestrictedAddressProps) {
    const [popover, setPopover] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
        null,
    );

    const popoverRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("newCampaign.inputs.restrictionsPicker");

    const handleOnRemove = useCallback(() => {
        onRemove(address);
    }, [address, onRemove]);

    function handlePopoverOpen() {
        setPopover(true);
    }

    function handlePopoverClose() {
        setPopover(false);
    }

    return (
        <div className={styles.root}>
            <div className={styles.account}>
                <div
                    className={classNames(styles.avatarBorder, {
                        [styles[type]]: true,
                    })}
                >
                    <Avatar address={address} width={20} height={20} />
                </div>
                <Account length="long" weight="medium" address={address} />
            </div>
            <Popover
                ref={popoverRef}
                open={popover}
                anchor={popoverAnchor}
                placement="top"
                onOpenChange={setPopover}
                margin={6}
                className={styles.popover}
            >
                <Typography size="xs">{t("removeAddress")}</Typography>
            </Popover>
            <button
                ref={setPopoverAnchor}
                onClick={handleOnRemove}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className={styles.removeButton}
            >
                <TrashIcon />
            </button>
        </div>
    );
}

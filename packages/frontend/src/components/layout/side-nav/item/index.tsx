import { Link } from "@/src/i18n/routing";
import type { SVGIcon } from "@/src/types/common";
import { Popover, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type FunctionComponent } from "react";

import styles from "./styles.module.css";

interface ItemProps {
    label: string;
    path: string;
    active: boolean;
    disabled?: boolean;
    claimsCount?: number;
    icon: FunctionComponent<SVGIcon>;
}

export function Item({
    label,
    path,
    active,
    disabled,
    claimsCount,
    icon: Icon,
}: ItemProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    function handlePopoverOpen() {
        setPopoverOpen(true);
    }

    function handlePopoverClose() {
        setPopoverOpen(false);
    }

    return (
        <>
            <Popover
                open={popoverOpen}
                anchor={anchor}
                ref={popoverRef}
                placement="right"
            >
                <div className={styles.popover}>
                    <Typography weight="medium" noWrap>
                        {label}
                    </Typography>
                </div>
            </Popover>
            <Link
                key={path}
                href={path}
                onNavigate={(e) => {
                    if (active) e.preventDefault();
                }}
            >
                <div
                    ref={setAnchor}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    className={classNames(styles.root, {
                        [styles.active]: active,
                        [styles.disabled]: disabled,
                    })}
                >
                    {Icon && <Icon className={styles.icon} />}
                    <AnimatePresence>
                        {claimsCount && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className={styles.claimsBadge}
                            >
                                <Typography
                                    size="xs"
                                    weight="medium"
                                    className={styles.claimsBadgeText}
                                >
                                    {claimsCount}
                                </Typography>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </Link>
        </>
    );
}

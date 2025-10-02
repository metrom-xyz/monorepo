import { Link } from "@/src/i18n/routing";
import type { SVGIcon } from "@/src/types/common";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { type FunctionComponent } from "react";

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
    return (
        <Link
            key={path}
            href={path}
            onNavigate={(e) => {
                if (active) e.preventDefault();
            }}
            className={styles.root}
        >
            <div
                className={classNames(styles.iconWrapper, {
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
            <Typography weight="medium" size="sm">
                {label}
            </Typography>
        </Link>
    );
}

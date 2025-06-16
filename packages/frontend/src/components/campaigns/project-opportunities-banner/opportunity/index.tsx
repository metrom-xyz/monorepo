import { Link } from "@/src/i18n/routing";
import { easeInOut, motion } from "motion/react";
import type { BrandColor } from "@/src/types/lv2-points-campaign";
import type { FunctionComponent } from "react";
import type { SVGIcon } from "@/src/types/common";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface OpportunityProps {
    name: string;
    href: string;
    brand: BrandColor;
    icon: FunctionComponent<SVGIcon>;
    illustration: FunctionComponent<SVGIcon>;
}

export function Opportunity({
    name,
    href,
    brand,
    icon: Icon,
    illustration: Illustration,
}: OpportunityProps) {
    return (
        <Link href={href} className={styles.link}>
            <motion.div
                whileHover="animate"
                className={styles.card}
                style={{
                    backgroundColor: brand.main,
                }}
            >
                <motion.div
                    variants={{
                        initial: { y: 0 },
                        animate: { y: -10 },
                    }}
                    transition={{
                        duration: 0.2,
                        ease: easeInOut,
                    }}
                    className={styles.illustration}
                >
                    {!!Illustration && <Illustration />}
                </motion.div>
                <div
                    className={styles.iconWrapper}
                    style={{
                        backgroundColor: brand.light,
                    }}
                >
                    <Icon className={styles.icon} />
                </div>
                <Typography
                    weight="medium"
                    uppercase
                    size="lg"
                    className={styles.title}
                >
                    {name}
                </Typography>
            </motion.div>
        </Link>
    );
}

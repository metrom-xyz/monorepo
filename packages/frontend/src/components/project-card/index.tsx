import { Link } from "@/src/i18n/routing";
import type { SVGIcon } from "@/src/types/common";
import { type FunctionComponent } from "react";
import { easeInOut, motion } from "motion/react";
import Marquee from "react-fast-marquee";
import { Theme, Typography } from "@metrom-xyz/ui";
import type { Branding } from "@/src/types/project";
import { getCrossVmChainData } from "@/src/utils/chain";
import { useTheme } from "next-themes";
import { ProjectCampaignsTotals } from "../project-campaigns-totals";
import classNames from "classnames";
import type { ChainWithType } from "@/src/types/chain";

import styles from "./styles.module.css";

interface ProjectCardProps {
    name: string;
    href: string;
    chains: ChainWithType[];
    activeCampaigns: number;
    totalCampaigns: number;
    types: string[];
    branding: Branding;
    icon: FunctionComponent<SVGIcon>;
    illustration: FunctionComponent<SVGIcon>;
}

const CHAINS_MARQUEE_LIMIT = 3;

const MotionLink = motion.create(Link);

export function ProjectCard({
    name,
    href,
    types,
    chains,
    activeCampaigns,
    totalCampaigns,
    branding,
    icon: Icon,
    illustration: Illustration,
}: ProjectCardProps) {
    const { resolvedTheme } = useTheme();

    const contrastColor =
        resolvedTheme === Theme.Dark
            ? branding.contrast.dark
            : branding.contrast.light;

    return (
        <MotionLink
            href={href}
            style={{
                backgroundColor: contrastColor,
            }}
            className={styles.root}
        >
            <motion.div whileHover="animate" className={styles.card}>
                <div
                    style={{
                        background: `linear-gradient(to left bottom, ${branding.main}, ${branding.light})`,
                    }}
                    className={styles.header}
                >
                    <motion.div
                        variants={{
                            initial: { scale: 1 },
                            animate: { scale: 0.82 },
                        }}
                        transition={{
                            duration: 0.2,
                            ease: easeInOut,
                        }}
                        className={styles.illustration}
                    >
                        {!!Illustration && <Illustration />}
                    </motion.div>
                    <div className={styles.types}>
                        {types.map((type) => (
                            <div key={type} className={styles.type}>
                                <Typography
                                    size="xs"
                                    weight="medium"
                                    uppercase
                                    className={styles.activeText}
                                >
                                    {type}
                                </Typography>
                            </div>
                        ))}
                    </div>
                    <div className={styles.headerContent}>
                        <div
                            className={styles.projectIconWrapper}
                            style={{ backgroundColor: branding.iconBackground }}
                        >
                            <Icon
                                style={{ color: branding.main }}
                                className={styles.projectIcon}
                            />
                        </div>
                        <div className={styles.headerData}>
                            <Typography
                                weight="semibold"
                                size="xl"
                                className={styles.mainText}
                            >
                                {name}
                            </Typography>
                            <ProjectCampaignsTotals
                                total={totalCampaigns}
                                active={activeCampaigns}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.chains}>
                    <Marquee
                        play={chains.length > CHAINS_MARQUEE_LIMIT}
                        speed={20}
                        gradient={chains.length > CHAINS_MARQUEE_LIMIT}
                        gradientColor={contrastColor}
                        gradientWidth={24}
                    >
                        {chains.map((chain) => {
                            const chainData = getCrossVmChainData(
                                chain.id,
                                chain.type,
                            );
                            if (!chainData) return null;

                            return (
                                <div
                                    key={`${chain.id}_${chain.type}`}
                                    className={styles.chainChip}
                                >
                                    <chainData.icon
                                        className={styles.chainIcon}
                                    />
                                    <Typography weight="medium" size="xs">
                                        {chainData.name}
                                    </Typography>
                                </div>
                            );
                        })}
                    </Marquee>
                </div>
            </motion.div>
        </MotionLink>
    );
}

export function SkeletonProjectCard() {
    return <div className={classNames(styles.root, styles.loading)}></div>;
}

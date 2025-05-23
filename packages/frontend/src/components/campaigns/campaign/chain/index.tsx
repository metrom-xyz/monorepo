import { useChainData } from "@/src/hooks/useChainData";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const chainData = useChainData(id);

    const ChainIcon = chainData?.icon;

    return (
        <div
            className={classNames(styles.root, commonStyles.chip)}
            style={{ backgroundColor: `${chainData?.brandColor}26` }}
        >
            {ChainIcon && <ChainIcon className={styles.icon} />}
            <Typography size="xs" uppercase>
                {chainData?.name}
            </Typography>
        </div>
    );
}

export function SkeletonChain() {
    return <Skeleton width={80} size="xl" />;
}

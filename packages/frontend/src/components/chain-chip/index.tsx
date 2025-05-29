import { useChainData } from "@/src/hooks/useChainData";
import { Typography, type TypographySize } from "@metrom-xyz/ui";

import styles from "./styles.module.css";
import classNames from "classnames";

interface ChainChipProps {
    id: number;
    size?: TypographySize;
    surface?: boolean;
}

export function ChainChip({
    id,
    size = "xs",
    surface = false,
}: ChainChipProps) {
    const chainData = useChainData(id);

    return (
        <div
            className={classNames(styles.root, {
                [styles[size]]: true,
                [styles.surface]: !!surface,
            })}
        >
            {chainData?.icon && (
                <chainData.icon
                    className={classNames(styles.icon, {
                        [styles[size]]: true,
                    })}
                />
            )}
            <Typography size={size} uppercase>
                {chainData?.name}
            </Typography>
        </div>
    );
}
